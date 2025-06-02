"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresModule = void 0;
const stores_1 = require("../../../libs/stores/src");
const address_entity_1 = require("../../../libs/stores/src/address.entity");
const product_entity_1 = require("../../../libs/stores/src/product.entity");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const geocoding_service_1 = require("./services/geocoding/geocoding.service");
const product_service_1 = require("./services/product/product.service");
const s3_service_1 = require("./services/s3/s3.service");
const store_mapper_service_1 = require("./services/store-mapper/store-mapper.service");
const stores_controller_1 = require("./stores.controller");
const stores_service_1 = require("./stores.service");
let StoresModule = class StoresModule {
};
exports.StoresModule = StoresModule;
exports.StoresModule = StoresModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DB_URL_STORES'),
                    entities: [stores_1.Store, address_entity_1.Address, product_entity_1.Product],
                    synchronize: true,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([stores_1.Store, address_entity_1.Address, product_entity_1.Product]),
            microservices_1.ClientsModule.register([
                {
                    name: 'PRODUCTS_CLIENT',
                    transport: microservices_1.Transport.TCP,
                    options: { port: 3003 },
                },
            ]),
        ],
        controllers: [stores_controller_1.StoresController],
        providers: [stores_service_1.StoresService, s3_service_1.S3Service, geocoding_service_1.GeocodingService, store_mapper_service_1.StoreMapperService, product_service_1.ProductService],
    })
], StoresModule);
//# sourceMappingURL=stores.module.js.map