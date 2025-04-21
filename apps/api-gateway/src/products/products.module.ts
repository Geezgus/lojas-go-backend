import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_CLIENT',
        transport: Transport.TCP,
        options: { port: 3003 },
      },
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
