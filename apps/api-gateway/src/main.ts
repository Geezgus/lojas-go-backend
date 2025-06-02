import { NestFactory } from '@nestjs/core'
import { ApiGatewayModule } from './api-gateway.module'

async function bootstrap() {
  if (!global.crypto) {
    global.crypto = require('crypto')
  }

  const app = await NestFactory.create(ApiGatewayModule)
  app.enableCors()
  await app.listen(process.env.PORT ?? 8080)
}
bootstrap()
