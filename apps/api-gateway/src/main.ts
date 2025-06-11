import { NestFactory } from '@nestjs/core'
import { AllExceptionsFilter } from '../common/filters/rcp-exception.filter'
import { ApiGatewayModule } from './api-gateway.module'

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule)
  app.enableCors()
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(process.env.PORT ?? 8080)
}
bootstrap()
