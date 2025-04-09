import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { GeocodingService } from './services/geocoding/geocoding.service'
import { S3Service } from './services/s3/s3.service'
import { StoresController } from './stores.controller'
import { StoresService } from './stores.service'

@Module({
  imports: [HttpModule],
  controllers: [StoresController],
  providers: [StoresService, S3Service, GeocodingService],
})
export class StoresModule {}
