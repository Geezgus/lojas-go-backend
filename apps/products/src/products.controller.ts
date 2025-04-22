import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ProductsService } from './products.service'

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('PRODUCTS:FIND_ALL')
  findAll() {
    return this.productsService.findAll()
  }

  @MessagePattern('PRODUCTS:FIND_ALL_WEB')
  findAllWeb(@Payload() data: { page: number; limit: number; search?: string; field?: string }) {
    const { page, limit, search, field } = data
    return this.productsService.findAllWeb(page, limit, search, field)
  }

  @MessagePattern('PRODUCTS:FIND_ONE')
  findOne(@Payload() { id }: { id: string }) {
    return this.productsService.findOne(id)
  }

  @MessagePattern('PRODUCTS:FIND_BY_CODES')
  async getProductsByCodes(@Payload() data: { codes: string[] }) {
    return this.productsService.findByCodes(data.codes)
  }

  @MessagePattern('PRODUCTS:CREATE')
  create(
    @Payload()
    payload: {
      fileData: { buffer: string; originalname: string; mimetype: string }
      data: string
    },
  ) {
    const productData = JSON.parse(payload.data)
    const imageData = this.getImageData(payload.fileData)
    return this.productsService.create(imageData, productData)
  }

  private getImageData(fileData: { buffer: string; originalname: string; mimetype: string }) {
    return {
      buffer: Buffer.from(fileData.buffer, 'base64'),
      originalname: fileData.originalname,
      mimetype: fileData.mimetype,
    }
  }
}
