import { CreateStoreDto, PartialUpdateStoreDto, UpdateStoreDto } from '@lib/stores/stores.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class StoresService {
  constructor(@Inject('STORES_CLIENT') private readonly storesClient: ClientProxy) {}

  findAll() {
    return this.storesClient.send('STORES:FIND_ALL', {})
  }

  findOne(id: string) {
    return this.storesClient.send('STORES:FIND_ONE', { id })
  }

  create(data: CreateStoreDto) {
    return this.storesClient.send('STORES:CREATE', { data })
  }

  update(id: string, data: UpdateStoreDto) {
    return this.storesClient.send('STORES:UPDATE', { id, data })
  }

  partialUpdate(id: string, data: PartialUpdateStoreDto) {
    return this.storesClient.send('STORES:PARTIAL_UPDATE', { id, data })
  }

  delete(id: string) {
    return this.storesClient.send('STORES:DELETE', { id })
  }
}
