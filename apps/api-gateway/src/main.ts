import { NestFactory } from '@nestjs/core'
import { ApiGatewayModule } from './api-gateway.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: '127.0.0.1', port: 3001 },
  })

  await app.startAllMicroservices()
  await app.listen(process.env.port ?? 3000)
}
bootstrap()
