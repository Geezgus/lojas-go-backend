export type User = { id: string; name: string; email: string; sub: string; businesses: Business[] }

type Business = { cnpj: string; name: string; logo: string }
