import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthDto, SigninDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.userService.signup(dto);
  }

  @Get('signin')
  signin(@Body() dto: SigninDto) {
    return this.userService.signin(dto);
  }
}
