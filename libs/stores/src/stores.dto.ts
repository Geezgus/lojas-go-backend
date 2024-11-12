export type CreateStoreDto = {
  cnpj: string
  latitude: number
  longitude: number
  name: string
  picture_url: string
}

export type UpdateStoreDto = CreateStoreDto

export type PartialUpdateStoreDto = Partial<UpdateStoreDto>
