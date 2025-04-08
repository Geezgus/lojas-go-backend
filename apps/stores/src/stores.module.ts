import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { S3Service } from './services/s3/s3.service'
import { StoresController } from './stores.controller'
import { StoresService } from './stores.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), HttpModule],
  controllers: [StoresController],
  providers: [StoresService, S3Service],
})
export class StoresModule {}
