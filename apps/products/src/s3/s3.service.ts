import { Injectable } from '@nestjs/common'

import * as AWS from 'aws-sdk'

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = 'lojasgo'
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4',
  })

  async uploadFile(file, name) {
    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: 'produts/' + name,
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

  async getMultipleImageUrls(keys: string[]): Promise<Record<string, string>> {
    const uniqueKeys = [...new Set(keys)].filter(Boolean)

    const batchSize = 20
    const results: Record<string, string> = {}

    for (let i = 0; i < uniqueKeys.length; i += batchSize) {
      const batch = uniqueKeys.slice(i, i + batchSize)
      const batchPromises = batch.map(async (key) => {
        return { key, url: await this.getImageUrl(key) }
      })

      const batchResults = await Promise.all(batchPromises)
      batchResults.forEach(({ key, url }) => {
        results[key] = url
      })
    }

    return results
  }
}
