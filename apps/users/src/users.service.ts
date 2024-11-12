import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users/users.dto'
import { User } from '@lib/users'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  findOne(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  create(dto: CreateUserDto): Promise<User> {
    throw new Error('Method not implemented.')
  }

  update(id: string, dto: UpdateUserDto): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  partialUpdate(id: string, dto: PartialUpdateUserDto): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }
}
