import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UserDto extends CreateUserDto {
  @IsUUID()
  id: string;
}

export interface CreateUserResponseDto {
  id: string;
  username: string;
}

export interface UserWithHashedPassword {
  id: string;
  username: string;
  passwordHash: string;
}
