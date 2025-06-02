import { User } from '@lib/users'
import { CreateUserDto, PartialUpdateUserDto, UpdateUserDto } from '@lib/users/users.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UsersServiceMock {
  private users: User[] = [
    { id: '1', name: 'User One', email: 'userone@email.com', sub: '1' },
    { id: '2', name: 'User Two', email: 'usertwo@email.com', sub: '2' },
  ]

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users)
  }

  findOne(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id) || null
    return Promise.resolve(user)
  }

  create(dto: CreateUserDto): Promise<User> {
    const newUser = { id: (this.users.length + 1).toString(), ...dto }
    this.users.push(newUser)
    return Promise.resolve(newUser)
  }

  update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null
    this.users[userIndex] = { ...this.users[userIndex], ...dto }
    return Promise.resolve(this.users[userIndex])
  }

  partialUpdate(id: string, dto: PartialUpdateUserDto): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null
    this.users[userIndex] = { ...this.users[userIndex], ...dto }
    return Promise.resolve(this.users[userIndex])
  }

  delete(id: string): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null
    const deletedUser = this.users.splice(userIndex, 1)[0]
    return Promise.resolve(deletedUser)
  }
}
