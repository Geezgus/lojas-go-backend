import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common'
import { StoresService } from './stores.service'
import { CreateStoreDto, PartialUpdateStoreDto, UpdateStoreDto } from '@lib/stores'

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
