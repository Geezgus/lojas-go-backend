import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data)
  }

  @Post('auth')
  authenticate(@Body() data: CreateUserDto) {
    return this.usersService.authenticate(data)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(id, data)
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() data: PartialUpdateUserDto) {
    return this.usersService.partialUpdate(id, data)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}
