import { ConflictException, HttpStatus, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from 'libs/products/src/products.entity'
import { Repository } from 'typeorm'
import { S3Service } from './s3/s3.service'

@Injectable()
export class ProductsService {
  constructor(
    private s3Service: S3Service,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find()
    return products
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } })
  }

  async create(fileData, product: Partial<Product>): Promise<{ status: HttpStatus; product: Product }> {
    await this.existingCODE(product.cod)
    const imageKey = await this.s3Service.uploadFile(fileData, product.cod)
    product.picture_key = imageKey

    const newProduct = await this.productRepository.save(product)
    return { status: HttpStatus.CREATED, product: newProduct }
  }

  private async existingCODE(code: string) {
    const result = await this.productRepository.findBy({ cod: code })
    console.log('result', result)
    if (result.length > 0) {
      throw new RpcException(new ConflictException('Dados duplicados encontrados. Este registro já existe.'))
    }
  }
}
