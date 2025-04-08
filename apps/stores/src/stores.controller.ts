import { CreateStoreDto, PartialUpdateStoreDto, UpdateStoreDto } from '@lib/stores'
import { Body, Controller } from '@nestjs/common'
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
    @Payload() fileData: { buffer: string; originalname: string; mimetype: string },
    @Body() { storeData }: { storeData: CreateStoreDto },
  ) {
    const imageData = {
      buffer: Buffer.from(fileData.buffer, 'base64'),
      originalname: fileData.originalname,
      mimetype: fileData.mimetype,
    }
    return this.storesService.create(imageData, storeData)
  }
  // create(@Payload() { data }: { data: CreateStoreDto }) {
  //   return this.storesService.create(data)
  // }

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
