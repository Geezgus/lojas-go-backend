import { Store } from '@lib/stores'
import { Product } from '@lib/stores/product.entity'
import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import { Repository } from 'typeorm'
import { StoresService } from '../../stores.service'

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCTS_CLIENT')
    private readonly productsClient: ClientProxy,
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

  async findByStore(storeId: string, page = 1, limit = 20) {
    // Busca produtos paginados
    const [storeProducts, total] = await this.repository.findAndCount({
      where: { store: { id: storeId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    // Caso nao tenha produtos, retorna vazio
    if (storeProducts.length === 0) {
      return {
        data: [],
        total: 0,
        currentPage: page,
        totalPages: 0,
      }
    }
    // Extrair codigos de produto
    const productCodes = storeProducts.map((product) => product.code)

    // Cria mapa para acesso dos dados
    const storeProductMap = storeProducts.reduce((map, product) => {
      map[product.code] = {
        price: product.price,
        status: product.status,
      }
      return map
    }, {})

    // Busca dados complenos no microservico de produtos
    const productDetails$ = this.productsClient.send('PRODUCTS:FIND_BY_CODES', { codes: productCodes })
    const productDetails = await firstValueFrom(productDetails$)

    // Mapeia detalhes
    const mappedProducts = productDetails.map((product) => ({
      ...product,
      price: storeProductMap[product.code].price,
      status: storeProductMap[product.code].status,
    }))

    return {
      data: mappedProducts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }
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
