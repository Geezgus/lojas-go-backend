import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Address } from './stores.entity'

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  user_id: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  cnpj: string

  @ValidateNested()
  @Type(() => Address)
  address: Address
}

export type StoreSummaryDto = { id: string; user_id: string; cnpj: string; name: string; picture_url: string }

export type UpdateStoreDto = CreateStoreDto

export type PartialUpdateStoreDto = Partial<UpdateStoreDto>
