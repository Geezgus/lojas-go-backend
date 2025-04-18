import { Store } from '@lib/stores'
import { Address } from '@lib/stores/address.entity'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GeocodingService } from './services/geocoding/geocoding.service'
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
        port: configService.get<number>('POSTGRES_PORT'),
        database: configService.get<string>('POSTGRES_DB'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        entities: [Store, Address],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Store, Address]),
  ],
  controllers: [StoresController],
  providers: [StoresService, S3Service, GeocodingService, StoreMapperService],
})
export class StoresModule {}
