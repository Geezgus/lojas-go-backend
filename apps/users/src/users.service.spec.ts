import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UsersServiceMock } from './users.service.mock'
import { CreateUserDto } from '@lib/users'

describe('UsersService', () => {
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: UsersService, useClass: UsersServiceMock }],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should find all users', async () => {
    const users = await service.findAll()
    expect(users).toHaveLength(2)
  })

  it('should find a user by ID', async () => {
    const user = await service.findOne('1')
    expect(user).toBeDefined()
    expect(user.id).toBe('1')
  })

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = { name: 'New User', email: 'newuser@example.com' }
    const createdUser = await service.create(createUserDto)

    expect(createdUser).toBeDefined()
    expect(createdUser.name).toBe(createUserDto.name)
    expect(createdUser.email).toBe(createUserDto.email)
  })
})
