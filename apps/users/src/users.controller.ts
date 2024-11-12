import { Controller, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users'

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('USERS:FIND_ALL')
  findAll() {
    return this.usersService.findAll()
  }

  @MessagePattern('USERS:FIND_ONE')
  findOne(@Payload() { id }: { id: string }) {
    return this.usersService.findOne(id)
  }

  @MessagePattern('USERS:CREATE')
  create(@Payload() { data }: { data: CreateUserDto }) {
    return this.usersService.create(data)
  }

  @MessagePattern('USERS:UPDATE')
  update(@Payload() { id, data }: { id: string; data: UpdateUserDto }) {
    return this.usersService.update(id, data)
  }

  @MessagePattern('USERS:PARTIAL_UPDATE')
  partialUpdate(@Payload() { id, data }: { id: string; data: PartialUpdateUserDto }) {
    return this.usersService.partialUpdate(id, data)
  }

  @MessagePattern('USERS:DELETE')
  delete(@Payload() { id }: { id: string }) {
    return this.usersService.delete(id)
  }
}
