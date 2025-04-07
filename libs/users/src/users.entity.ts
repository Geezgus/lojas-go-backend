export type User = { id: string; name: string; email: string; sub: string; stores: Store[] }

type Store = { cnpj: string; name: string; logo: string }
