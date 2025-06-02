"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const users_module_1 = require("./users.module");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(users_module_1.UsersModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            port: 3001,
        },
    });
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map