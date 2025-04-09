import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'

export class Address {
  @IsNotEmpty()
  postalCode: string

  @IsNotEmpty()
  street: string

  @IsNotEmpty()
  number: string

  complement?: string

  @IsNotEmpty()
  neighborhood: string

  @IsNotEmpty()
  city: string

  @IsNotEmpty()
  stateCode: string
}

export class Store {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  user_id: string

  @IsNotEmpty()
  @IsString()
  cnpj: string

  @IsNotEmpty()
  @IsNumber()
  latitude: number

  @IsNotEmpty()
  @IsNumber()
  longitude: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  pricture_key: string

  @ValidateNested()
  @Type(() => Address)
  address: Address
}
