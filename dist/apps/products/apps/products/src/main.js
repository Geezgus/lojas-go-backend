"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const products_module_1 = require("./products.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(products_module_1.ProductsModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            port: 3003,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
    }));
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map