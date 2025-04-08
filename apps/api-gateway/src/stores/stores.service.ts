import { PartialUpdateStoreDto, UpdateStoreDto } from '@lib/stores/stores.dto'
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

  findByUserId(id: string) {
    return this.storesClient.send('STORES:FIND_BY_USER_ID', { id })
  }

  create(file: Express.Multer.File) {
    const fileData = {
      buffer: file.buffer.toString('base64'),
      originalname: file.originalname,
      mimetype: file.mimetype,
    }
    return this.storesClient.send('STORES:CREATE', fileData)
  }
  // create(data: CreateStoreDto) {
  //   return this.storesClient.send('STORES:CREATE', { data })
  // }

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
