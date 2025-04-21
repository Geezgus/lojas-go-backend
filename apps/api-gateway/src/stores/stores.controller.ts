import { CreateStoreDto, PartialUpdateStoreDto } from '@lib/stores'
import { Product } from '@lib/stores/product.entity'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { StoresService } from './stores.service'

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    if (userId) {
      return this.storesService.findByUserId(userId)
    }
    return this.storesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() data: CreateStoreDto) {
    return this.storesService.create(file, data)
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data: PartialUpdateStoreDto,
  ) {
    return this.storesService.update(id, file, data)
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() data: PartialUpdateStoreDto) {
    return this.storesService.partialUpdate(id, data)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.storesService.delete(id)
  }

  @Post(':storeId/products')
  addNewProduct(@Param('storeId') storeId: string, @Body() data: Partial<Product>) {
    return this.storesService.addNewProduct(storeId, data)
  }
}
