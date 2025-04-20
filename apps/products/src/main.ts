import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ProductsModule } from './products.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ProductsModule, {
    transport: Transport.TCP,
    options: {
      port: 3003,
    },
  })
  await app.listen()
}
bootstrap()
