import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthResponseDto {
  token: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  username: string;
}
