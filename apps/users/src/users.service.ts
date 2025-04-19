import { User } from '@lib/users'
import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users/users.dto'
import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ sub: dto.sub })

    console.log(existingUser)
    if (!existingUser) {
      return this.create(dto)
    }

    return existingUser
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find()
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id })

    if (!user) {
      throw new RpcException(new NotFoundException('Usuario nao encontrado'))
    }

    return user
  }

  // findOneBySub(sub: string): Promise<User | null> {
  //   const existingUser = this.users.find((user) => user.sub === sub)
  //   return Promise.resolve(existingUser || null)
  // }

  async create(newUser: User): Promise<{ status: HttpStatus; user: User }> {
    const user = await this.usersRepository.save(newUser)

    return { status: HttpStatus.CREATED, user: user }
  }

  async update(id: string, dto: UpdateUserDto): Promise<{ status: HttpStatus; user: User }> {
    if (dto.sub) {
      await this.existingSub(dto.sub)
    }

    let updatedUser: User = {
      id: id,
      ...dto,
    }

    updatedUser = await this.usersRepository.save(updatedUser)

    return { status: HttpStatus.ACCEPTED, user: updatedUser }
  }

  partialUpdate(id: string, dto: PartialUpdateUserDto): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  private async existingSub(sub: string) {
    const result = await this.usersRepository.findBy({ sub })

    if (result) {
      throw new RpcException(new ConflictException('Dados duplicados encontrados. Este usuário já existe.'))
    }
  }
}
