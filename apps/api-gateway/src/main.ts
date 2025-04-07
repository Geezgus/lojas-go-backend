import { NestFactory } from '@nestjs/core'
import { ApiGatewayModule } from './api-gateway.module'

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule)
  app.enableCors()
  await app.listen(process.env.port ?? 3000)
}
bootstrap()
