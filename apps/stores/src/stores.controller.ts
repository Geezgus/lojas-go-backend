import { PartialUpdateStoreDto, UpdateStoreDto } from '@lib/stores'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { StoresService } from './stores.service'

@Controller()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @MessagePattern('STORES:FIND_ALL')
  findAll() {
    return this.storesService.findAll()
  }

  @MessagePattern('STORES:FIND_ONE')
  findOne(@Payload() { id }: { id: string }) {
    return this.storesService.findOne(id)
  }

  @MessagePattern('STORES:FIND_BY_USER_ID')
  findByUserId(@Payload() { id }: { id: string }) {
    return this.storesService.findByUserId(id)
  }

  @MessagePattern('STORES:CREATE')
  create(
    @Payload()
    payload: {
      fileData: { buffer: string; originalname: string; mimetype: string }
      data: string
    },
  ) {
    const storeData = JSON.parse(payload.data)
    const imageData = {
      buffer: Buffer.from(payload.fileData.buffer, 'base64'),
      originalname: payload.fileData.originalname,
      mimetype: payload.fileData.mimetype,
    }
    return this.storesService.create(imageData, storeData)
  }

  @MessagePattern('STORES:UPDATE')
  update(@Payload() { id, data }: { id: string; data: UpdateStoreDto }) {
    return this.storesService.update(id, data)
  }

  @MessagePattern('STORES:PARTIAL_UPDATE')
  partialUpdate(@Payload() { id, data }: { id: string; data: PartialUpdateStoreDto }) {
    return this.storesService.partialUpdate(id, data)
  }

  @MessagePattern('STORES:DELETE')
  delete(@Payload() { id }: { id: string }) {
    return this.storesService.delete(id)
  }
}
