import {
  CreateStoreDto,
  PartialUpdateStoreDto,
  Store,
  StoreSummaryDto,
  StoreWebResponseDto,
  UpdateStoreDto,
} from '@lib/stores'
import { Address } from '@lib/stores/address.entity'
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEqual } from 'lodash'
import { Repository } from 'typeorm'
import { GeocodingService } from './services/geocoding/geocoding.service'
import { S3Service } from './services/s3/s3.service'
import { StoreMapperService } from './services/store-mapper/store-mapper.service'

@Injectable()
export class StoresService {
  // Mocked data for demonstration purposes
  private stores: Store[] = [
    {
      id: '1',
      user_id: '1',
      cnpj: '12345678000123',
      name: 'Empresa A',
      picture_key: 'stores/364981 (1).png',
      latitude: -23.5505,
      longitude: -46.6333,
      address: {
        id: 'aa',
        street: 'Rua A',
        number: '123',
        complement: 'Apto 101',
        neighborhood: 'Centro',
        city: 'São Paulo',
        stateCode: 'SP',
        postalCode: '01000000',
      },
    },
    {
      id: '2',
      user_id: '1',
      cnpj: '98765432000198',
      name: 'Empresa B',
      picture_key: 'stores/364979.png',
      latitude: -23.5505,
      longitude: -46.6333,
      address: {
        id: 'bb',
        street: 'Rua B',
        number: '456',
        complement: 'Sala 202',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        stateCode: 'SP',
        postalCode: '01400000',
      },
    },
  ]

  constructor(
    private s3Service: S3Service,
    private geoService: GeocodingService,
    private mapper: StoreMapperService,

    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  findAll(): Promise<Store[]> {
    return this.storesRepository.find()
  }

  async findOne(id: string): Promise<StoreWebResponseDto | null> {
    const store = await this.storesRepository.findOneBy({ id })
    // const store = this.stores.find((store) => store.id === id)

    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`)
    }

    const dto = this.mapper.mapToWebDto(store)

    return dto
  }

  async findByUserId(userId: string): Promise<StoreSummaryDto[]> {
    const stores = await Promise.all(
      this.stores.filter((store) => store.user_id === userId).map((store) => this.mapper.mapToSummary(store)),
    )
    return stores
  }

  async create(fileData, storeData: CreateStoreDto): Promise<{ status: HttpStatus; store: StoreWebResponseDto }> {
    const imageKey = await this.s3Service.uploadFile(fileData, storeData.cnpj)
    const { latitude, longitude } = await this.geoService.getCoordinates(storeData.address)

    let newStore: Store = {
      user_id: storeData.user_id,
      cnpj: storeData.cnpj,
      name: storeData.name,
      picture_key: imageKey,
      latitude: latitude,
      longitude: longitude,
      address: storeData.address,
    }

    newStore = await this.storesRepository.save(newStore)
    const dto = await this.mapper.mapToWebDto(newStore)

    return { status: HttpStatus.CREATED, store: dto }
  }

  async update(id: string, file, data: UpdateStoreDto): Promise<{ status: HttpStatus; store: StoreWebResponseDto }> {
    const business: Store = this.stores.find((store) => store.id === id)

    if (!business) {
      throw new NotFoundException(`Store with CNPJ ${data.cnpj} not found`)
    }

    let picture_key: string | undefined = await this.updateImage(file, data.cnpj)
    const [latitude, longitude] = await this.updateGeoPoints(business.address, data.address)

    const updatedBusiness: Store = {
      ...business,
      ...data,
      ...(picture_key && { picture_key }),
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
    }

    let index = this.stores.indexOf(business)
    this.stores[index] = updatedBusiness

    const webDto = await this.mapper.mapToWebDto(updatedBusiness)
    return { status: HttpStatus.ACCEPTED, store: webDto }
  }

  partialUpdate(id: string, dto: PartialUpdateStoreDto): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  private async updateImage(file, cnpj): Promise<string | undefined> {
    if (file) {
      const uploadResult = await this.s3Service.uploadFile(file, cnpj)
      return uploadResult
    }
    return undefined
  }

  private async updateGeoPoints(
    currentAddress: Address,
    newAddress: Address,
  ): Promise<[number | undefined, number | undefined]> {
    let latitude: number | undefined = undefined
    let longitude: number | undefined = undefined

    if (!isEqual(currentAddress, newAddress)) {
      const coordinates = await this.geoService.getCoordinates(newAddress)
      latitude = coordinates.latitude
      longitude = coordinates.longitude
    }

    return [latitude, latitude]
  }
}
