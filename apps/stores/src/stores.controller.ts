import { PartialUpdateStoreDto } from '@lib/stores'
import { Product } from '@lib/stores/product.entity'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ProductService } from './services/product/product.service'
import { StoresService } from './stores.service'

@Controller()
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly productsService: ProductService,
  ) {}

  @MessagePattern('STORES:FIND_ALL')
  findAll() {
    return this.storesService.findAll()
  }

  @MessagePattern('STORES:FIND_ONE')
  findOne(@Payload() { id }: { id: string }) {
    return this.storesService.findOneWeb(id)
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
    const imageData = this.getImageData(payload.fileData)
    return this.storesService.create(imageData, storeData)
  }

  @MessagePattern('STORES:UPDATE')
  update(
    @Payload()
    payload: {
      id: string
      file: { buffer: string; originalname: string; mimetype: string }
      data: string
    },
  ) {
    const storeData = JSON.parse(payload.data)
    let imageData = undefined
    if (payload.file) {
      imageData = this.getImageData(payload.file)
    }
    return this.storesService.update(payload.id, imageData, storeData)
  }

  @MessagePattern('STORES:PARTIAL_UPDATE')
  partialUpdate(@Payload() { id, data }: { id: string; data: PartialUpdateStoreDto }) {
    return this.storesService.partialUpdate(id, data)
  }

  @MessagePattern('STORES:DELETE')
  delete(@Payload() { id }: { id: string }) {
    return this.storesService.delete(id)
  }

  @MessagePattern('STORES_PRODUCTS:ADD')
  async addNewProduct(@Payload() { storeId, data }: { storeId: string; data: Partial<Product> }) {
    const store = await this.storesService.findOneEntity(storeId)
    const response = this.productsService.add(data, store)
    return response
  }

  @MessagePattern('STORES_PRODUCTS:FIND_BY_STORE')
  async findByStore(
    @Payload() data: { storeId: string; page: number; limit: number; sortField?: string; sortOrder?: number },
  ) {
    const { storeId, page, limit, sortField, sortOrder } = data
    const response = await this.productsService.findByStore(storeId, page, limit, sortField, sortOrder)
    return response
  }

  @MessagePattern('STORES_PRODUCTS:UPDATE')
  async updateProduct(
    @Payload()
    payload: {
      productId: string
      data: Partial<Product>
    },
  ) {
    const response = await this.productsService.update(payload.productId, payload.data)
    return response
  }

  @MessagePattern('STORES_PRODUCTS:DELETE')
  async deleteProduct(@Payload() { productId }: { productId: string }) {
    const response = await this.productsService.delete(productId)
    return response
  }

  @MessagePattern('STORES_PRODUCTS:BULK-DELETE')
  async bulkDelete(data: { ids: string[] }) {
    return this.productsService.bulkDelete(data.ids)
  }

  private getImageData(fileData: { buffer: string; originalname: string; mimetype: string }) {
    return {
      buffer: Buffer.from(fileData.buffer, 'base64'),
      originalname: fileData.originalname,
      mimetype: fileData.mimetype,
    }
  }
}
