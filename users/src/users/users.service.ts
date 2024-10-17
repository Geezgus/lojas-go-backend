import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByCredentials(dto: SigninDto) {
    const existingUser = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          email: dto.email,
        },
      })
      .catch((error) => {
        throw new RpcException(
          new NotFoundException('User with the provided email does not exist.'),
        );
      });

    const verifyProvider = await this.prisma.userProvider
      .findUniqueOrThrow({
        where: {
          userId: existingUser.id,
          providerId: dto.providerId,
        },
      })
      .catch((error) => {
        throw new RpcException(
          new ForbiddenException(
            'No matching provider credentials found for this user.',
          ),
        );
      });

    // TO DO: Retornar token de autenticação?
    return { userId: existingUser.id };
  }

  async findOne() {}

  async update(id: number, dto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: id },
      data: dto,
    });
  }

  async delete() {}
}
