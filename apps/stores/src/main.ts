import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { StoresModule } from './stores.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(StoresModule, {
    transport: Transport.TCP,
    options: {
      port: 3002,
    },
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  await app.listen()
}
bootstrap()
