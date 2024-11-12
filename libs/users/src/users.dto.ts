export type CreateUserDto = {
  name: string
  email: string
}

export type UpdateUserDto = CreateUserDto

export type PartialUpdateUserDto = Partial<UpdateUserDto>
