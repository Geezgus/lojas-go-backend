import { CreateStoreDto, PartialUpdateStoreDto, Store, StoreSummaryDto, StoreWebResponseDto } from '@lib/stores'
import { Address } from '@lib/stores/address.entity'
import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { isEqual } from 'lodash'
import { Repository } from 'typeorm'
import { GeocodingService } from './services/geocoding/geocoding.service'
import { S3Service } from './services/s3/s3.service'
import { StoreMapperService } from './services/store-mapper/store-mapper.service'

@Injectable()
export class StoresService {
  constructor(
    private s3Service: S3Service,
    private geoService: GeocodingService,
    private mapper: StoreMapperService,

    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    let response = await this.storesRepository.find({
      relations: {
        address: true,
      },
    })

    return response
  }

  async findOneEntity(id: string): Promise<Store | null> {
    const store = await this.storesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        address: true,
      },
    })

    if (!store) {
      throw new RpcException(new NotFoundException('Loja nao encontrada'))
    }

    return store
  }

  async findOneWeb(id: string): Promise<StoreWebResponseDto | null> {
    const store = await this.findOneEntity(id)
    const dto = this.mapper.mapToWebDto(store)

    return dto
  }

  async findByUserId(userId: string): Promise<StoreSummaryDto[]> {
    const stores = Promise.all(
      (
        await this.storesRepository.find({
          where: {
            user_id: userId,
          },
          relations: {
            address: true,
          },
        })
      ).map((store: Store) => this.mapper.mapToSummary(store)),
    )

    return stores
  }

  async create(fileData, storeData: CreateStoreDto): Promise<{ status: HttpStatus; store: StoreWebResponseDto }> {
    await this.existingCNPJ(storeData.cnpj)

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

  async update(
    id: string,
    file,
    data: PartialUpdateStoreDto,
  ): Promise<{ status: HttpStatus; store: StoreWebResponseDto }> {
    if (data.cnpj) {
      await this.existingCNPJ(data.cnpj)
    }

    const business = await this.findOneEntity(id)

    let picture_key: string | undefined = await this.updateImage(file, data.cnpj)

    let [latitude, longitude] = [undefined, undefined]
    if (data.address) {
      ;[latitude, longitude] = await this.updateGeoPoints(business.address, data.address)
    }
    let updatedBusiness: Store = {
      id: id,
      ...business,
      ...data,
      ...(picture_key && { picture_key }),
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
    }

    updatedBusiness = await this.storesRepository.save(updatedBusiness)

    const webDto = await this.mapper.mapToWebDto(updatedBusiness)
    return { status: HttpStatus.ACCEPTED, store: webDto }
  }

  partialUpdate(id: string, dto: PartialUpdateStoreDto): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  async delete(id: string): Promise<{ status: HttpStatus; store: Store }> {
    const store = await this.findOneEntity(id)
    this.storesRepository.remove(store)

    return { status: HttpStatus.ACCEPTED, store: store }
  }

  private async existingCNPJ(cnpj: string) {
    const result = await this.storesRepository.findBy({ cnpj: cnpj })
    if (result.length > 0) {
      throw new RpcException(new ConflictException('Dados duplicados encontrados. Este registro já existe.'))
    }
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

    return [latitude, longitude]
  }
}
