"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
let S3Service = class S3Service {
    constructor() {
        this.AWS_S3_BUCKET = 'lojasgo';
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
            signatureVersion: 'v4',
        });
    }
    async uploadFile(file, name) {
        const params = {
            Bucket: this.AWS_S3_BUCKET,
            Key: 'produts/' + name,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
        const uploadResult = await this.s3.upload(params).promise();
        return uploadResult.Key;
    }
    async getImageUrl(imageKey) {
        const params = {
            Bucket: this.AWS_S3_BUCKET,
            Key: imageKey,
            Expires: 3600,
        };
        const signedUrl = await this.s3.getSignedUrlPromise('getObject', params);
        return signedUrl;
    }
    async getMultipleImageUrls(keys) {
        const uniqueKeys = [...new Set(keys)].filter(Boolean);
        const batchSize = 20;
        const results = {};
        for (let i = 0; i < uniqueKeys.length; i += batchSize) {
            const batch = uniqueKeys.slice(i, i + batchSize);
            const batchPromises = batch.map(async (key) => {
                return { key, url: await this.getImageUrl(key) };
            });
            const batchResults = await Promise.all(batchPromises);
            batchResults.forEach(({ key, url }) => {
                results[key] = url;
            });
        }
        return results;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)()
], S3Service);
//# sourceMappingURL=s3.service.js.map