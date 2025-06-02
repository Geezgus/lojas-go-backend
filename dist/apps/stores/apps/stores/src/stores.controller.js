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
exports.StoresController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const product_service_1 = require("./services/product/product.service");
const stores_service_1 = require("./stores.service");
let StoresController = class StoresController {
    constructor(storesService, productsService) {
        this.storesService = storesService;
        this.productsService = productsService;
    }
    findAll() {
        return this.storesService.findAll();
    }
    findOne({ id }) {
        return this.storesService.findOneWeb(id);
    }
    findByUserId({ id }) {
        return this.storesService.findByUserId(id);
    }
    create(payload) {
        const storeData = JSON.parse(payload.data);
        const imageData = this.getImageData(payload.fileData);
        return this.storesService.create(imageData, storeData);
    }
    update(payload) {
        const storeData = JSON.parse(payload.data);
        let imageData = undefined;
        if (payload.file) {
            imageData = this.getImageData(payload.file);
        }
        return this.storesService.update(payload.id, imageData, storeData);
    }
    partialUpdate({ id, data }) {
        return this.storesService.partialUpdate(id, data);
    }
    delete({ id }) {
        return this.storesService.delete(id);
    }
    async addNewProduct({ storeId, data }) {
        const store = await this.storesService.findOneEntity(storeId);
        const response = this.productsService.add(data, store);
        return response;
    }
    async bulkAddNewProduct({ storeId, data }) {
        const store = await this.storesService.findOneEntity(storeId);
        return this.productsService.bulkAdd(data, store);
    }
    async findByStore(data) {
        const { storeId, page, limit, sortField, sortOrder, globalFilter } = data;
        const response = await this.productsService.findByStore(storeId, page, limit, sortField, sortOrder, globalFilter);
        return response;
    }
    async findAllByStore({ storeId }) {
        return await this.productsService.findAll(storeId);
    }
    async updateProduct(payload) {
        const response = await this.productsService.update(payload.productId, payload.data);
        return response;
    }
    async deleteProduct({ productId }) {
        const response = await this.productsService.delete(productId);
        return response;
    }
    async bulkDelete(data) {
        return this.productsService.bulkDelete(data.ids);
    }
    getImageData(fileData) {
        return {
            buffer: Buffer.from(fileData.buffer, 'base64'),
            originalname: fileData.originalname,
            mimetype: fileData.mimetype,
        };
    }
};
exports.StoresController = StoresController;
__decorate([
    (0, microservices_1.MessagePattern)('STORES:FIND_ALL'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES:FIND_ONE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES:FIND_BY_USER_ID'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "findByUserId", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES:CREATE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "create", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES:UPDATE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "update", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES:PARTIAL_UPDATE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "partialUpdate", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES:DELETE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "delete", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES_PRODUCTS:ADD'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "addNewProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES_PRODUCTS:BULK_ADD'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "bulkAddNewProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES_PRODUCTS:FIND_BY_STORE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findByStore", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES_PRODUCTS:FINDALL_BY_STORE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findAllByStore", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES_PRODUCTS:UPDATE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "updateProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES_PRODUCTS:DELETE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "deleteProduct", null);
__decorate([
    (0, microservices_1.MessagePattern)('STORES_PRODUCTS:BULK-DELETE'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "bulkDelete", null);
exports.StoresController = StoresController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [stores_service_1.StoresService,
        product_service_1.ProductService])
], StoresController);
//# sourceMappingURL=stores.controller.js.map