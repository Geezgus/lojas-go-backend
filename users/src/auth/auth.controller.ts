import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCommands } from 'src/enums/user-command.enum';
import { AuthService } from './auth.service';
import { AuthDto, SigninDto } from './dto/auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: UserCommands.CREATE_USER })
  signup(dto: AuthDto): Promise<any> {
    return this.authService.signup(dto);
  }

  @MessagePattern({ cmd: UserCommands.SIGNIN })
  signin(dto: SigninDto): Promise<any> {
    return this.authService.signin(dto);
  }
}
