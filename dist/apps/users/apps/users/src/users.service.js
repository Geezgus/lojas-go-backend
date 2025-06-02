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
exports.UsersService = void 0;
const users_1 = require("../../../libs/users/src");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async login(dto) {
        const existingUser = await this.usersRepository.findOneBy({ sub: dto.sub });
        if (!existingUser) {
            return this.create(dto);
        }
        return { status: common_1.HttpStatus.ACCEPTED, user: existingUser };
    }
    async findAll() {
        return await this.usersRepository.find();
    }
    async findOne(id) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new microservices_1.RpcException(new common_1.NotFoundException('Usuario nao encontrado'));
        }
        return user;
    }
    async create(newUser) {
        const user = await this.usersRepository.save(newUser);
        return { status: common_1.HttpStatus.CREATED, user: user };
    }
    async update(id, dto) {
        if (dto.sub) {
            await this.existingSub(dto.sub);
        }
        let updatedUser = {
            id: id,
            ...dto,
        };
        updatedUser = await this.usersRepository.save(updatedUser);
        return { status: common_1.HttpStatus.ACCEPTED, user: updatedUser };
    }
    partialUpdate(id, dto) {
        throw new Error('Method not implemented.');
    }
    delete(id) {
        throw new Error('Method not implemented.');
    }
    async existingSub(sub) {
        const result = await this.usersRepository.findBy({ sub });
        if (result) {
            throw new microservices_1.RpcException(new common_1.ConflictException('Dados duplicados encontrados. Este usuário já existe.'));
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map