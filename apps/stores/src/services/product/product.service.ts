import { Store } from '@lib/stores'
import { Product } from '@lib/stores/product.entity'
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { firstValueFrom } from 'rxjs'
import { In, Repository } from 'typeorm'

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCTS_CLIENT')
    private readonly productsClient: ClientProxy,
    @InjectRepository(Product)
    private repository: Repository<Product>,

    // Removed unused storesService dependency
  ) {}

  async add(data: Partial<Product>, store: Store) {
    if (!data.code) {
      throw new RpcException(new ConflictException('O código do produto é obrigatório.'))
    }
    await this.isRegistred(store, data.code)

    const product = this.repository.create({ ...data, store })
    const result = await this.repository.save(product)
    return result
  }

  async findAll(store: Store): Promise<Product[]> {
    let products = await this.repository.find({
      where: { store },
      order: { createdAt: 'ASC' },
    })

    return products
  }

  async findByStore(
    storeId: string,
    page = 1,
    limit = 10,
    sortField?: string,
    sortOrder: number = 1,
    globalFilter?: string,
  ) {
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

    // Busca dados complenos no microservico de produtos
    const productDetails$ = globalFilter
      ? this.productsClient.send('PRODUCTS:FIND_BY_FILTER', { filter: globalFilter })
      : this.productsClient.send('PRODUCTS:FIND_BY_CODES', { codes: productCodes })
    const productDetails = await firstValueFrom(productDetails$)

    if (globalFilter && globalFilter.trim() && productDetails.length === 0) {
      return {
        data: [],
        total: 0,
        currentPage: page,
        totalPages: 0,
      }
    }

    const filteredCodes = globalFilter && globalFilter.trim() ? productDetails.map((pd) => pd.code) : productCodes

    const filteredStoreProducts = storeProducts.filter((sp) => filteredCodes.includes(sp.code))

    let mappedProducts = filteredStoreProducts.map((storeProduct) => {
      const productDetail = productDetails.find((product) => product.code === storeProduct.code)
      return {
        ...storeProduct,
        price: storeProduct.price,
        status: storeProduct.status,
        name: productDetail?.name,
        description: productDetail?.description,
        picture_url: productDetail?.picture_url,
      }
    })

    if (sortField) {
      mappedProducts = mappedProducts.sort((a, b) => {
        if (sortOrder === 1) {
          return a[sortField] < b[sortField] ? -1 : 1
        } else {
          return a[sortField] > b[sortField] ? -1 : 1
        }
      })
    }

    return {
      data: mappedProducts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne() {}

  async update(id: string, data: Partial<Product>) {
    const product = await this.repository.findOne({ where: { id } })
    if (!product) {
      throw new RpcException(new ConflictException('Produto não encontrado.'))
    }

    data.id = id
    return await this.repository.save(data)
  }

  async delete(id: string) {
    const product = await this.repository.findOne({ where: { id } })
    if (!product) {
      throw new RpcException(new ConflictException('Produto não encontrado.'))
    }

    await this.repository.delete(id)
    return product
  }

  async bulkDelete(ids: string[]): Promise<{ success: boolean }> {
    const products: Product[] = await this.repository.find({
      where: { id: In(ids) },
    })

    if (products.length !== ids.length) {
      throw new RpcException(new NotFoundException('Um ou mais produtos não foram encontrados'))
    }

    // Remover todos os produtos de uma vez
    await this.repository.remove(products)

    return { success: true }
  }

  private async isRegistred(store: Store, code: string) {
    let products = (await this.findAll(store)).filter((product) => product.code === code)

    if (products.length > 0) {
      throw new RpcException(new ConflictException('Dados duplicados encontrados. Este registro já existe.'))
    }
  }
}
