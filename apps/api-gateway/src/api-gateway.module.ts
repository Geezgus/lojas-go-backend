import { Module } from '@nestjs/common'
import { ApiGatewayController } from './api-gateway.controller'
import { ApiGatewayService } from './api-gateway.service'
import { ProductsModule } from './products/products.module'
import { StoresModule } from './stores/stores.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [UsersModule, StoresModule, ProductsModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
