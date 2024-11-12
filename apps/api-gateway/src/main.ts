import { NestFactory } from '@nestjs/core'
import { ApiGatewayModule } from './api-gateway.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule)
  await app.listen(process.env.port ?? 3000)
}
bootstrap()
