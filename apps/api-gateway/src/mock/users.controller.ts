import { Controller, Get, Post, Put, Patch, Delete, Param, Body } from '@nestjs/common'

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return { message: 'GET / - Mock: Users list' }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: `GET /${id} - Mock: Specific user` }
  }

  @Post()
  create(@Body() createUserDto: any) {
    return { message: 'POST / - Mock: Created user' }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return { message: `PUT /${id} - Mock: Updated user` }
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() partialUpdateUserDto: any) {
    return { message: `PATCH /${id} - Mock: Partially updated user` }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return { message: `DELETE /${id} - Mock: Deleted user` }
  }
}
