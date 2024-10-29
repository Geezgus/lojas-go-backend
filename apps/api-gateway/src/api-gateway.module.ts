import { Module } from '@nestjs/common'
import { ApiGatewayController } from './api-gateway.controller'
import { ApiGatewayService } from './api-gateway.service'
import { UsersController } from './mock/users.controller'

@Module({
  imports: [],
  controllers: [ApiGatewayController, UsersController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
