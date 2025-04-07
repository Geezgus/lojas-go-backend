import { CreateStoreDto, PartialUpdateStoreDto, Store, StoreSummaryDto, UpdateStoreDto } from '@lib/stores'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StoresService {
  // Mocked data for demonstration purposes
  private stores: Store[] = [
    {
      id: '1',
      user_id: '1',
      cnpj: '12345678000123',
      name: 'Empresa A',
      picture_url: 'https://i0.wp.com/designbox.com.br/wp-content/uploads/2017/04/364981.jpg',
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
      picture_url: 'https://i1.wp.com/designbox.com.br/wp-content/uploads/2017/04/364979.jpg',
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

  findAll(): Promise<Store[]> {
    throw new Error('Method not implemented.')
  }

  findOne(id: string): Promise<Store | null> {
    throw new Error('Method not implemented.')
  }

  findByUserId(userId: string): Promise<StoreSummaryDto[]> {
    const stores = this.stores.filter((store) => store.user_id === userId).map((store) => this.mapStoreToSummary(store))
    return Promise.resolve(stores)
  }

  create(dto: CreateStoreDto): Promise<Store> {
    throw new Error('Method not implemented.')
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

  private mapStoreToSummary(store: Store): StoreSummaryDto {
    return { id: store.id, user_id: store.user_id, cnpj: store.cnpj, name: store.name, picture_url: store.picture_url }
  }
}
