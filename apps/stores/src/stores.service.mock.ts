import { CreateStoreDto, PartialUpdateStoreDto, UpdateStoreDto } from '@lib/stores/stores.dto'
import { Store } from '@lib/stores'
import { Injectable } from '@nestjs/common'

@Injectable()
export class StoresServiceMock {
  private stores: Store[] = [
    {
      id: '1',
      cnpj: '12345678901234',
      latitude: -23.55052,
      longitude: -46.633308,
      name: 'Store One',
      picture_url:
        'https://images.unsplash.com/photo-1601599561096-f87c95fff1e9?w=202&h=200&fit=crop&crop=faces,focalpoint',
    },
    {
      id: '2',
      cnpj: '56789012345678',
      latitude: -23.55782,
      longitude: -46.639847,
      name: 'Store Two',
      picture_url:
        'https://images.unsplash.com/photo-1688318421222-1a592eb1fdfb?w=202&h=200&fit=crop&crop=faces,focalpoint',
    },
  ]

  findAll(): Promise<Store[]> {
    return Promise.resolve(this.stores)
  }

  findOne(id: string): Promise<Store | null> {
    const store = this.stores.find((store) => store.id === id) || null
    return Promise.resolve(store)
  }

  create(dto: CreateStoreDto): Promise<Store> {
    const newStore = { id: (this.stores.length + 1).toString(), ...dto }
    this.stores.push(newStore)
    return Promise.resolve(newStore)
  }

  update(id: string, dto: UpdateStoreDto): Promise<Store | null> {
    const storeIndex = this.stores.findIndex((store) => store.id === id)
    if (storeIndex === -1) return null
    this.stores[storeIndex] = { ...this.stores[storeIndex], ...dto }
    return Promise.resolve(this.stores[storeIndex])
  }

  partialUpdate(id: string, dto: PartialUpdateStoreDto): Promise<Store | null> {
    const storeIndex = this.stores.findIndex((store) => store.id === id)
    if (storeIndex === -1) return null
    this.stores[storeIndex] = { ...this.stores[storeIndex], ...dto }
    return Promise.resolve(this.stores[storeIndex])
  }

  delete(id: string): Promise<Store | null> {
    const storeIndex = this.stores.findIndex((store) => store.id === id)
    if (storeIndex === -1) return null
    const deletedStore = this.stores.splice(storeIndex, 1)[0]
    return Promise.resolve(deletedStore)
  }
}
