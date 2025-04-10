import {
  CreateStoreDto,
  PartialUpdateStoreDto,
  Store,
  StoreSummaryDto,
  StoreWebResponseDto,
  UpdateStoreDto,
} from '@lib/stores'
import { HttpStatus, Injectable } from '@nestjs/common'
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
      pricture_key: 'stores/364981 (1).png',
      latitude: -23.5505,
      longitude: -46.6333,
      address: {
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
      pricture_key: 'stores/364979.png',
      latitude: -23.5505,
      longitude: -46.6333,
      address: {
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
  ) {}

  findAll(): Promise<Store[]> {
    throw new Error('Method not implemented.')
  }

  findOne(id: string): Promise<StoreWebResponseDto | null> {
    const store = this.stores.find((store) => store.id === id)

    const dto = this.mapper.toWebResponse(store)

    return dto
  }

  async findByUserId(userId: string): Promise<StoreSummaryDto[]> {
    const stores = await Promise.all(
      this.stores.filter((store) => store.user_id === userId).map((store) => this.mapStoreToSummary(store)),
    )
    return stores
  }

  async create(fileData, storeData: CreateStoreDto): Promise<{ status: HttpStatus; store: StoreWebResponseDto }> {
    const imageKey = await this.s3Service.uploadFile(fileData, storeData.cnpj)
    const { latitude, longitude } = await this.geoService.getCoordinates(storeData.address)

    const newStore: Store = {
      id: (this.stores.length + 1).toString(),
      user_id: storeData.user_id,
      cnpj: storeData.cnpj,
      name: storeData.name,
      pricture_key: imageKey,
      latitude: latitude,
      longitude: longitude,
      address: storeData.address,
    }

    this.stores.push(newStore)
    const dto = await this.findOne(newStore.id)

    return { status: HttpStatus.CREATED, store: dto }
  }

  update(id: string, dto: UpdateStoreDto): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  partialUpdate(id: string, dto: PartialUpdateStoreDto): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  private async mapStoreToSummary(store: Store): Promise<StoreSummaryDto> {
    const picture_url: string = await this.getImageUrl(store.pricture_key)

    return { id: store.id, user_id: store.user_id, cnpj: store.cnpj, name: store.name, picture_url: picture_url }
  }

  private async getImageUrl(key: string): Promise<string> {
    const url = await this.s3Service.getImageUrl(key)
    return url
  }
}
