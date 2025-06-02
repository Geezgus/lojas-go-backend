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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const products_service_1 = require("./products.service");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    findAll() {
        return this.productsService.findAll();
    }
    findAllWeb(data) {
        const { page, limit, search, field } = data;
        return this.productsService.findAllWeb(page, limit, search, field);
    }
    findOne({ id }) {
        return this.productsService.findOne(id);
    }
    async getProductsByCodes(data) {
        return this.productsService.findByCodes(data.codes);
    }
    async getProductsByFilter(data) {
        return this.productsService.findByFilter(data.filter);
    }
    create(payload) {
        const productData = JSON.parse(payload.data);
        const imageData = this.getImageData(payload.fileData);
        return this.productsService.create(imageData, productData);
    }
    getImageData(fileData) {
        return {
            buffer: Buffer.from(fileData.buffer, 'base64'),
            originalname: fileData.originalname,
            mimetype: fileData.mimetype,
        };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, microservices_1.MessagePattern)('PRODUCTS:FIND_ALL'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, microservices_1.MessagePattern)('PRODUCTS:FIND_ALL_WEB'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllWeb", null);
__decorate([
    (0, microservices_1.MessagePattern)('PRODUCTS:FIND_ONE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, microservices_1.MessagePattern)('PRODUCTS:FIND_BY_CODES'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductsByCodes", null);
__decorate([
    (0, microservices_1.MessagePattern)('PRODUCTS:FIND_BY_FILTER'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductsByFilter", null);
__decorate([
    (0, microservices_1.MessagePattern)('PRODUCTS:CREATE'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map