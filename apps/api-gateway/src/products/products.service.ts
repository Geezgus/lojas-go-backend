import { HttpException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Product } from 'libs/products/src/products.entity'
import { catchError } from 'rxjs'

@Injectable()
export class ProductsService {
  constructor(@Inject('PRODUCTS_CLIENT') private readonly productsClient: ClientProxy) {}

  findAll() {
    return this.productsClient.send('PRODUCTS:FIND_ALL', {})
  }

  findAllWeb(page: number, limit: number, search?: string, field?: string) {
    return this.productsClient.send('PRODUCTS:FIND_ALL_WEB', { page, limit, search, field })
  }

  findOne(id: string) {
    return this.productsClient.send('PRODUCTS:FIND_ONE', { id })
  }

  create(file: Express.Multer.File, data: Partial<Product>) {
    const fileData = {
      buffer: file.buffer.toString('base64'),
      originalname: file.originalname,
      mimetype: file.mimetype,
    }
    return this.productsClient.send('PRODUCTS:CREATE', { fileData, ...data }).pipe(
      catchError((error: any) => {
        throw new HttpException(error.message, error.status)
      }),
    )
  }
}
