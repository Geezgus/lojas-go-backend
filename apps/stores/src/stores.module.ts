import { Store } from '@lib/stores'
import { Address } from '@lib/stores/address.entity'
import { Product } from '@lib/stores/product.entity'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GeocodingService } from './services/geocoding/geocoding.service'
import { ProductService } from './services/product/product.service'
import { S3Service } from './services/s3/s3.service'
import { StoreMapperService } from './services/store-mapper/store-mapper.service'
import { StoresController } from './stores.controller'
import { StoresService } from './stores.service'

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_STORES_PORT'),
        database: configService.get<string>('POSTGRES_STORES_DB'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        entities: [Store, Address, Product],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Store, Address, Product]),
    ClientsModule.register([
      {
        name: 'PRODUCTS_CLIENT',
        transport: Transport.TCP,
        options: { port: 3003 },
      },
    ]),
  ],
  controllers: [StoresController],
  providers: [StoresService, S3Service, GeocodingService, StoreMapperService, ProductService],
})
export class StoresModule {}
