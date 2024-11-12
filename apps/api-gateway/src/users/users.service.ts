import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users/users.dto'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private readonly usersClient: ClientProxy) {}

  findAll() {
    return this.usersClient.send('USERS:FIND_ALL', {})
  }

  findOne(id: string) {
    return this.usersClient.send('USERS:FIND_ONE', { id: id })
  }

  create(data: CreateUserDto) {
    return this.usersClient.send('USERS:CREATE', { data: data })
  }

  update(id: string, data: UpdateUserDto) {
    return this.usersClient.send('USERS:UPDATE', { id, data })
  }

  partialUpdate(id: string, data: PartialUpdateUserDto) {
    return this.usersClient.send('USERS:PARTIAL_UPDATE', { id, data })
  }

  delete(id: string) {
    return this.usersClient.send('USERS:DELETE', { id: id })
  }
}
