"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_entity_1 = require("../../../../../libs/stores/src/product.entity");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const rxjs_1 = require("rxjs");
const typeorm_2 = require("typeorm");
let ProductService = class ProductService {
    constructor(productsClient, repository) {
        this.productsClient = productsClient;
        this.repository = repository;
    }
    async add(data, store) {
        if (!data.code) {
            throw new microservices_1.RpcException(new common_1.ConflictException('O código do produto é obrigatório.'));
        }
        await this.isRegistred(store, data.code);
        const product = this.repository.create({ ...data, store });
        const result = await this.repository.save(product);
        return result;
    }
    async bulkAdd(data, store) {
        try {
            const existing = await this.repository.find({
                where: { store },
                select: ['code'],
            });
            const existingCodes = new Set(existing.map((p) => p.code));
            const toInsert = data.filter((d) => !existingCodes.has(d.code));
            if (toInsert.length === 0) {
                return { inserted: 0 };
            }
            await this.repository
                .createQueryBuilder()
                .insert()
                .into(product_entity_1.Product)
                .values(toInsert.map((d) => ({ ...d, store })))
                .orIgnore()
                .execute();
            return { inserted: data.length };
        }
        catch (err) {
            throw new microservices_1.RpcException(err.message);
        }
    }
    async findAll(storeId) {
        let products = await this.repository.find({
            where: { store: { id: storeId } },
            order: { createdAt: 'ASC' },
        });
        return await this.hydrateProductsWithDetails(products);
    }
    async findByStore(storeId, page = 1, limit = 10, sortField, sortOrder = 1, globalFilter) {
        const [storeProducts, total] = await this.repository.findAndCount({
            where: { store: { id: storeId } },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        if (storeProducts.length === 0) {
            return {
                data: [],
                total: 0,
                currentPage: page,
                totalPages: 0,
            };
        }
        let mappedProducts = await this.hydrateProductsWithDetails(storeProducts, globalFilter);
        if (sortField) {
            mappedProducts = mappedProducts.sort((a, b) => {
                if (sortOrder === 1) {
                    return a[sortField] < b[sortField] ? -1 : 1;
                }
                else {
                    return a[sortField] > b[sortField] ? -1 : 1;
                }
            });
        }
        return {
            data: mappedProducts,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne() { }
    async update(id, data) {
        const product = await this.repository.findOne({ where: { id } });
        if (!product) {
            throw new microservices_1.RpcException(new common_1.ConflictException('Produto não encontrado.'));
        }
        data.id = id;
        return await this.repository.save(data);
    }
    async delete(id) {
        const product = await this.repository.findOne({ where: { id } });
        if (!product) {
            throw new microservices_1.RpcException(new common_1.ConflictException('Produto não encontrado.'));
        }
        await this.repository.delete(id);
        return product;
    }
    async bulkDelete(ids) {
        const products = await this.repository.find({
            where: { id: (0, typeorm_2.In)(ids) },
        });
        if (products.length !== ids.length) {
            throw new microservices_1.RpcException(new common_1.NotFoundException('Um ou mais produtos não foram encontrados'));
        }
        await this.repository.remove(products);
        return { success: true };
    }
    async isRegistred(store, code) {
        let products = (await this.findAll(store.id)).filter((product) => product.code === code);
        if (products.length > 0) {
            throw new microservices_1.RpcException(new common_1.ConflictException('Dados duplicados encontrados. Este registro já existe.'));
        }
    }
    async hydrateProductsWithDetails(storeProducts, globalFilter) {
        const productCodes = storeProducts.map((product) => product.code);
        const productDetails$ = globalFilter
            ? this.productsClient.send('PRODUCTS:FIND_BY_FILTER', { filter: globalFilter })
            : this.productsClient.send('PRODUCTS:FIND_BY_CODES', { codes: productCodes });
        const productDetails = await (0, rxjs_1.firstValueFrom)(productDetails$);
        const filteredCodes = globalFilter && globalFilter.trim() ? productDetails.map((pd) => pd.code) : productCodes;
        const filteredStoreProducts = storeProducts.filter((sp) => filteredCodes.includes(sp.code));
        return filteredStoreProducts.map((storeProduct) => {
            const productDetail = productDetails.find((pd) => pd.code === storeProduct.code);
            return {
                ...storeProduct,
                price: storeProduct.price,
                status: storeProduct.status,
                name: productDetail?.name,
                description: productDetail?.description,
                picture_url: productDetail?.picture_url,
            };
        });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('PRODUCTS_CLIENT')),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map