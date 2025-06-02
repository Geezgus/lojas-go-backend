"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const stores_module_1 = require("./stores.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(stores_module_1.StoresModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            port: 3002,
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