import { Module } from '@nestjs/common'
import { StoresService } from './stores.service'
import { StoresController } from './stores.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'STORES_CLIENT',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
    ]),
  ],
  providers: [StoresService],
  controllers: [StoresController],
})
export class StoresModule {}
