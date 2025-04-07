export type CreateUserDto = { name: string; email: string; sub: string }

export type UpdateUserDto = CreateUserDto

export type PartialUpdateUserDto = Partial<UpdateUserDto>
