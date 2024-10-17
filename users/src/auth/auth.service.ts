import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthDto, SigninDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private userService: UsersService,
  ) {}

  async signup(dto: AuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      return this.addProvider(existingUser.id, dto.providerId);
    }

    return this.createUser(dto);
  }

  async signin(dto: SigninDto) {
    return await this.userService.findByCredentials(dto);
  }

  private async createUser(dto: AuthDto) {
    const data = {
      name: dto.name,
      email: dto.email,
      profilePicture: dto.profilePicture,
      providers: {
        create: {
          providerId: dto.providerId,
        },
      },
    };

    try {
      return await this.prisma.user.create({ data });
    } catch (e) {
      return this.handleError(e);
    }
  }

  private async addProvider(id: number, provider: string) {
    const newData = {
      where: {
        id: id,
      },
      data: {
        providers: {
          create: {
            providerId: provider,
          },
        },
      },
    };

    try {
      return await this.prisma.user.update(newData);
    } catch (e) {
      return this.handleError(e);
    }
  }

  private handleError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new RpcException(new ForbiddenException('Credentials taken'));
      }
    }
    throw new RpcException(error);
  }
}
