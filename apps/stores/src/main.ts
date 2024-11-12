import { NestFactory } from '@nestjs/core'
import { StoresModule } from './stores.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(StoresModule, {
    transport: Transport.TCP,
    options: {
      port: 3002,
    },
  })
  await app.listen()
}
bootstrap()
