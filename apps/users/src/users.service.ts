import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users/users.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  findAll() {
    throw new Error('Method not implemented.')
  }

  findOne(id: string) {
    throw new Error('Method not implemented.')
  }

  create(dto: CreateUserDto) {
    throw new Error('Method not implemented.')
  }

  update(id: string, dto: UpdateUserDto) {
    throw new Error('Method not implemented.')
  }

  partialUpdate(id: string, dto: PartialUpdateUserDto) {
    throw new Error('Method not implemented.')
  }

  delete(id: string) {
    throw new Error('Method not implemented.')
  }
}
