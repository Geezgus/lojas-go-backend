import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Product } from 'libs/products/src/products.entity'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() data: Partial<Product>) {
    return this.productsService.create(file, data)
  }
}
