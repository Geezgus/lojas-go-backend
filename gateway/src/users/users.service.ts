import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { UserCommands } from 'src/enums/user-command.enum';
import { AuthDto, SigninDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  async signup(dto: AuthDto) {
    const pattern = { cmd: UserCommands.CREATE_USER };
    return await this.usersClient
      .send(pattern, dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
      .toPromise();
  }

  async signin(dto: SigninDto) {
    const pattern = { cmd: UserCommands.SIGNIN };
    return await this.usersClient
      .send(pattern, dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
      .toPromise();
  }
}
