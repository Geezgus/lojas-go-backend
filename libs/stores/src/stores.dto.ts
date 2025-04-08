export type CreateStoreDto = {
  user_id: string
  name: string
  cnpj: string
  postalCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  stateCode: string
}

export type StoreSummaryDto = { id: string; user_id: string; cnpj: string; name: string; picture_url: string }

export type UpdateStoreDto = CreateStoreDto

export type PartialUpdateStoreDto = Partial<UpdateStoreDto>
