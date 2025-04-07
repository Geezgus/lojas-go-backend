import { User } from '@lib/users'
import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users/users.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersService {
  // Mocked data for demonstration purposes
  private users: User[] = [
    {
      id: '1',
      email: 'stefane.main@gmail.com',
      name: 'Stefane Maria',
      sub: 'google-oauth2|105899574833026762742',
      businesses: [
        {
          name: 'Business 1',
          cnpj: '12345678000123',
          logo: 'https://i0.wp.com/designbox.com.br/wp-content/uploads/2017/04/364981.jpg',
        },
        {
          name: 'Business 2',
          cnpj: '98765432000198',
          logo: 'https://i1.wp.com/designbox.com.br/wp-content/uploads/2017/04/364979.jpg',
        },
      ],
    },
    {
      id: '2',
      email: 'stefane.maria0901@gmail.com',
      name: 'Stefane Maria',
      sub: 'google-oauth2|114250707402792790436',
      businesses: [],
    },
  ]

  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  findOne(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  findOneBySub(sub: string): Promise<User | null> {
    const existingUser = this.users.find((user) => user.sub === sub)
    return Promise.resolve(existingUser || null)
  }

  create(dto: CreateUserDto): Promise<User> {
    var newUser: User = { id: '1', businesses: [], ...dto }
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
