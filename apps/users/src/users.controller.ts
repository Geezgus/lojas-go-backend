import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UsersService } from './users.service'

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

  @MessagePattern('USERS:AUTH')
  autenticate(@Payload() { data }: { data: CreateUserDto }) {
    return this.usersService.login(data)
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
