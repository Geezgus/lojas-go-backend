import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ProductsService } from './products.service'
import { S3Service } from './s3/s3.service'

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private s3Service: S3Service,
  ) {}

  @MessagePattern('PRODUCTS:FIND_ALL')
  findAll() {
    return this.productsService.findAll()
  }

  @MessagePattern('PRODUCTS:FIND_ALL_WEB')
  findAllWeb(@Payload() data: { page: number; limit: number }) {
    const { page, limit } = data
    return this.productsService.findAllWeb(page, limit)
  }

  @MessagePattern('PRODUCTS:FIND_ONE')
  findOne(@Payload() { id }: { id: string }) {
    return this.productsService.findOne(id)
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
