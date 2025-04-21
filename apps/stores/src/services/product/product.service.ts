import { Store } from '@lib/stores'
import { Product } from '@lib/stores/product.entity'
import { ConflictException, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StoresService } from '../../stores.service'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,

    private readonly storesService: StoresService,
  ) {}

  async add(data: Partial<Product>, store: Store) {
    await this.isRegistred(store, data.code)

    const product = this.repository.create({ ...data, store })
    const result = await this.repository.save(product)
    return result
  }

  async findAll(store: Store): Promise<Product[]> {
    let products = await this.repository.find({
      where: { store },
    })

    return products
  }

  async findOne() {}

  async update() {}

  async remove() {}

  private async isRegistred(store: Store, code: string) {
    let products = (await this.findAll(store)).filter((product) => product.code === code)

    if (products.length > 0) {
      throw new RpcException(new ConflictException('Dados duplicados encontrados. Este registro já existe.'))
    }
  }
}
