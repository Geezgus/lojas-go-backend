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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const products_dto_1 = require("../../../libs/products/src/products.dto");
const products_entity_1 = require("../../../libs/products/src/products.entity");
const typeorm_2 = require("typeorm");
const s3_service_1 = require("./s3/s3.service");
let ProductsService = class ProductsService {
    constructor(s3Service, productRepository) {
        this.s3Service = s3Service;
        this.productRepository = productRepository;
    }
    async findAll() {
        const products = await this.productRepository.find();
        return products;
    }
    async findAllWeb(page = 1, limit = 20, search, field) {
        const queryBuilder = this.productRepository.createQueryBuilder('product');
        if (search && field) {
            if (field == 'code') {
                queryBuilder.where('product.code LIKE :search', { search: `${search}%` });
            }
            else if (field == 'name') {
                queryBuilder.where('product.name LIKE :search', { search: `${search}%` });
            }
        }
        else if (search) {
            queryBuilder.where('product.code LIKE :search OR product.name LIKE :search', { search: `%${search}%` });
        }
        queryBuilder.skip((page - 1) * limit).take(limit);
        const [products, total] = await Promise.all([
            queryBuilder.getMany(),
            search ? queryBuilder.getCount() : this.productRepository.count(),
        ]);
        const imageKeys = products.map((product) => product.picture_key).filter(Boolean);
        const imageUrlMap = await this.s3Service.getMultipleImageUrls(imageKeys);
        const productsDto = products.map((product) => {
            const dto = new products_dto_1.ProductsDto();
            Object.assign(dto, product);
            dto.picture_url = product.picture_key ? imageUrlMap[product.picture_key] : null;
            if ('picture_key' in dto) {
                delete dto.picture_key;
            }
            return dto;
        });
        return {
            data: productsDto,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        return await this.productRepository.findOne({ where: { id } });
    }
    async findByCodes(codes) {
        if (!codes.length)
            return [];
        const products = await this.productRepository.find({
            where: { code: (0, typeorm_2.In)(codes) },
        });
        const imageKeys = products.map((product) => product.picture_key).filter(Boolean);
        const imageUrlMap = await this.s3Service.getMultipleImageUrls(imageKeys);
        return products.map((product) => {
            const dto = new products_dto_1.ProductsDto();
            Object.assign(dto, product);
            dto.picture_url = product.picture_key ? imageUrlMap[product.picture_key] : null;
            if ('picture_key' in dto) {
                delete dto.picture_key;
            }
            return dto;
        });
    }
    async findByFilter(filter) {
        if (!filter || filter.trim() === '')
            return [];
        const products = await this.productRepository.find({
            where: [{ code: (0, typeorm_2.ILike)(`%${filter}%`) }, { name: (0, typeorm_2.ILike)(`%${filter}%`) }],
        });
        const imageKeys = products.map((product) => product.picture_key).filter(Boolean);
        const imageUrlMap = await this.s3Service.getMultipleImageUrls(imageKeys);
        return products.map((product) => {
            const dto = new products_dto_1.ProductsDto();
            Object.assign(dto, product);
            dto.picture_url = product.picture_key ? imageUrlMap[product.picture_key] : null;
            if ('picture_key' in dto) {
                delete dto.picture_key;
            }
            return dto;
        });
    }
    async create(fileData, product) {
        await this.existingCODE(product.code);
        const imageKey = await this.s3Service.uploadFile(fileData, product.code);
        product.picture_key = imageKey;
        const newProduct = await this.productRepository.save(product);
        return { status: common_1.HttpStatus.CREATED, product: newProduct };
    }
    async existingCODE(code) {
        const result = await this.productRepository.findBy({ code: code });
        if (result.length > 0) {
            throw new microservices_1.RpcException(new common_1.ConflictException('Dados duplicados encontrados. Este registro já existe.'));
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(products_entity_1.Product)),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map