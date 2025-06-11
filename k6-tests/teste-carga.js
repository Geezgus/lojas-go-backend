import { check, sleep } from 'k6'
import http from 'k6/http'

export const options = {
  vus: 50, // usuários virtuais simultâneos
  duration: '300s', // duração do teste
}

export default function () {
  const res = http.get(
    'https://loyal-determination-production.up.railway.app/stores/84ff6d35-69c8-441e-9f7a-2d922fe40e65/products?page=1&limit=10',
  )

  check(res, {
    'status é 200': (r) => r.status === 200,
  })

  sleep(1) // simula tempo entre as requisições
}
