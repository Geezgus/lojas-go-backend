import { CreateStoreDto, PartialUpdateStoreDto, UpdateStoreDto } from '@lib/stores'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { StoresService } from './stores.service'

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  findAll() {
    return this.storesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id)
  }

  @Get('/user/:userId')
  findByUserId(@Param('userId') id: string) {
    return this.storesService.findByUserId(id)
  }

  @Post()
  create(@Body() data: CreateStoreDto) {
    return this.storesService.create(data)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateStoreDto) {
    return this.storesService.update(id, data)
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() data: PartialUpdateStoreDto) {
    return this.storesService.partialUpdate(id, data)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.storesService.delete(id)
  }
}
