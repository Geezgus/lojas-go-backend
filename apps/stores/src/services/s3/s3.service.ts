import { Injectable } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'

import * as AWS from 'aws-sdk'

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}

  AWS_S3_BUCKET = 'lojasgo'
  s3 = new AWS.S3({
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  })

  async uploadFile(file) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: 'stores/' + file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    }

    const uploadResult = await this.s3.upload(params).promise()

    return uploadResult.Key
  }

  async getImageUrl(imageKey: string) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: imageKey,
      Expires: 3600, // 1 hora de validade
    }

    const signedUrl = await this.s3.getSignedUrlPromise('getObject', params)

    return signedUrl
  }
}
