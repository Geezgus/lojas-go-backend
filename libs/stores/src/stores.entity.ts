export type Store = {
  id: string
  user_id: string
  cnpj: string
  latitude: number
  longitude: number
  name: string
  pricture_key: string
  address: Address
}

type Address = {
  postalCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  stateCode: string
}
