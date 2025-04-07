import { User } from '@lib/users'
import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users/users.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  findOne(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  findOneBySub(sub: string): Promise<User | null> {
    var existingUser: User = {
      id: '2',
      name: 'John Doe',
      email: 'mail@mail.com',
      sub: 'sub',
      businesses: [
        { cnpj: '12345678901234', name: 'My Business 1' },
        { cnpj: '12345678901235', name: 'My Business 2' },
      ],
    }

    return new Promise((resolve) => {
      resolve(existingUser)
    })
  }

  create(dto: CreateUserDto): Promise<User> {
    var newUser: User = {
      id: '1',
      businesses: [
        { cnpj: '12345678901234', name: 'My Business 1' },
        { cnpj: '12345678901235', name: 'My Business 2' },
      ],
      ...dto,
    }
    return new Promise((resolve) => {
      resolve(newUser)
    })
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

  async verifyAndCreateIfNeeded(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneBySub(dto.sub)

    if (!existingUser) {
      return this.create(dto)
    }

    return existingUser
  }
}
