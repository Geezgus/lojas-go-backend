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
exports.StoresService = void 0;
const stores_1 = require("../../../libs/stores/src");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const lodash_1 = require("lodash");
const typeorm_2 = require("typeorm");
const geocoding_service_1 = require("./services/geocoding/geocoding.service");
const s3_service_1 = require("./services/s3/s3.service");
const store_mapper_service_1 = require("./services/store-mapper/store-mapper.service");
let StoresService = class StoresService {
    constructor(s3Service, geoService, mapper, storesRepository) {
        this.s3Service = s3Service;
        this.geoService = geoService;
        this.mapper = mapper;
        this.storesRepository = storesRepository;
    }
    async findAll() {
        let response = await this.storesRepository.find({
            relations: {
                address: true,
            },
        });
        return response;
    }
    async findOneEntity(id) {
        const store = await this.storesRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                address: true,
            },
        });
        if (!store) {
            throw new microservices_1.RpcException(new common_1.NotFoundException('Loja nao encontrada'));
        }
        return store;
    }
    async findOneWeb(id) {
        const store = await this.findOneEntity(id);
        const dto = this.mapper.mapToWebDto(store);
        return dto;
    }
    async findByUserId(userId) {
        const stores = Promise.all((await this.storesRepository.find({
            where: {
                user_id: userId,
            },
            relations: {
                address: true,
            },
        })).map((store) => this.mapper.mapToSummary(store)));
        return stores;
    }
    async create(fileData, storeData) {
        await this.existingCNPJ(storeData.cnpj);
        const imageKey = await this.s3Service.uploadFile(fileData, storeData.cnpj);
        const { latitude, longitude } = await this.geoService.getCoordinates(storeData.address);
        let newStore = {
            user_id: storeData.user_id,
            cnpj: storeData.cnpj,
            name: storeData.name,
            picture_key: imageKey,
            latitude: latitude,
            longitude: longitude,
            address: storeData.address,
        };
        newStore = await this.storesRepository.save(newStore);
        const dto = await this.mapper.mapToWebDto(newStore);
        return { status: common_1.HttpStatus.CREATED, store: dto };
    }
    async update(id, file, data) {
        if (data.cnpj) {
            await this.existingCNPJ(data.cnpj);
        }
        const business = await this.findOneEntity(id);
        let picture_key = await this.updateImage(file, data.cnpj);
        let [latitude, longitude] = [undefined, undefined];
        if (data.address) {
            ;
            [latitude, longitude] = await this.updateGeoPoints(business.address, data.address);
        }
        let updatedBusiness = {
            id: id,
            ...business,
            ...data,
            ...(picture_key && { picture_key }),
            ...(latitude !== undefined && { latitude }),
            ...(longitude !== undefined && { longitude }),
        };
        updatedBusiness = await this.storesRepository.save(updatedBusiness);
        const webDto = await this.mapper.mapToWebDto(updatedBusiness);
        return { status: common_1.HttpStatus.ACCEPTED, store: webDto };
    }
    partialUpdate(id, dto) {
        throw new Error('Method not implemented.');
    }
    async delete(id) {
        const store = await this.findOneEntity(id);
        this.storesRepository.remove(store);
        return { status: common_1.HttpStatus.ACCEPTED, store: store };
    }
    async existingCNPJ(cnpj) {
        const result = await this.storesRepository.findBy({ cnpj: cnpj });
        if (result.length > 0) {
            throw new microservices_1.RpcException(new common_1.ConflictException('Dados duplicados encontrados. Este registro já existe.'));
        }
    }
    async updateImage(file, cnpj) {
        if (file) {
            const uploadResult = await this.s3Service.uploadFile(file, cnpj);
            return uploadResult;
        }
        return undefined;
    }
    async updateGeoPoints(currentAddress, newAddress) {
        let latitude = undefined;
        let longitude = undefined;
        if (!(0, lodash_1.isEqual)(currentAddress, newAddress)) {
            const coordinates = await this.geoService.getCoordinates(newAddress);
            latitude = coordinates.latitude;
            longitude = coordinates.longitude;
        }
        return [latitude, longitude];
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(stores_1.Store)),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        geocoding_service_1.GeocodingService,
        store_mapper_service_1.StoreMapperService,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map