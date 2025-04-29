import { ConflictException, HttpStatus, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductsDto } from 'libs/products/src/products.dto'
import { Product } from 'libs/products/src/products.entity'
import { ILike, In, Repository } from 'typeorm'
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

  async findAllWeb(
    page = 1,
    limit = 20,
    search?: string,
    field?: string,
  ): Promise<{ data: ProductsDto[]; total: number; currentPage: number; totalPages: number }> {
    // Construir query com base nos filtros
    const queryBuilder = this.productRepository.createQueryBuilder('product')

    if (search && field) {
      if (field == 'code') {
        queryBuilder.where('product.code LIKE :search', { search: `${search}%` })
      } else if (field == 'name') {
        queryBuilder.where('product.name LIKE :search', { search: `${search}%` })
      }
    } else if (search) {
      queryBuilder.where('product.code LIKE :search OR product.name LIKE :search', { search: `%${search}%` })
    }

    // Adiciona paginacao
    queryBuilder.skip((page - 1) * limit).take(limit)

    // Executa query
    const [products, total] = await Promise.all([
      queryBuilder.getMany(),
      search ? queryBuilder.getCount() : this.productRepository.count(),
    ])

    // Extrai todas as chaves de imagem
    const imageKeys = products.map((product) => product.picture_key).filter(Boolean)

    // Obtem as URLs das imagens
    const imageUrlMap = await this.s3Service.getMultipleImageUrls(imageKeys)

    // Mapeia as URLs das imagens
    const productsDto = products.map((product) => {
      const dto = new ProductsDto()
      Object.assign(dto, product)

      dto.picture_url = product.picture_key ? imageUrlMap[product.picture_key] : null

      if ('picture_key' in dto) {
        delete dto.picture_key
      }

      return dto
    })

    return {
      data: productsDto,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } })
  }

  async findByCodes(codes: string[]): Promise<ProductsDto[]> {
    if (!codes.length) return []

    const products = await this.productRepository.find({
      where: { code: In(codes) },
    })

    const imageKeys = products.map((product) => product.picture_key).filter(Boolean)

    const imageUrlMap = await this.s3Service.getMultipleImageUrls(imageKeys)

    return products.map((product) => {
      const dto = new ProductsDto()
      Object.assign(dto, product)

      dto.picture_url = product.picture_key ? imageUrlMap[product.picture_key] : null

      if ('picture_key' in dto) {
        delete dto.picture_key
      }

      return dto
    })
  }

  async findByFilter(filter: string): Promise<ProductsDto[]> {
    if (!filter || filter.trim() === '') return []

    const products = await this.productRepository.find({
      where: [{ code: ILike(`%${filter}%`) }, { name: ILike(`%${filter}%`) }],
    })

    const imageKeys = products.map((product) => product.picture_key).filter(Boolean)

    const imageUrlMap = await this.s3Service.getMultipleImageUrls(imageKeys)

    return products.map((product) => {
      const dto = new ProductsDto()
      Object.assign(dto, product)

      dto.picture_url = product.picture_key ? imageUrlMap[product.picture_key] : null

      if ('picture_key' in dto) {
        delete dto.picture_key
      }

      return dto
    })
  }

  async create(fileData, product: Partial<Product>): Promise<{ status: HttpStatus; product: Product }> {
    await this.existingCODE(product.code)
    const imageKey = await this.s3Service.uploadFile(fileData, product.code)
    product.picture_key = imageKey

    const newProduct = await this.productRepository.save(product)
    return { status: HttpStatus.CREATED, product: newProduct }
  }

  private async existingCODE(code: string) {
    const result = await this.productRepository.findBy({ code: code })
    if (result.length > 0) {
      throw new RpcException(new ConflictException('Dados duplicados encontrados. Este registro já existe.'))
    }
  }
}
