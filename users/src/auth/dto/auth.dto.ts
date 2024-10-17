import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  profilePicture: string;
}

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
