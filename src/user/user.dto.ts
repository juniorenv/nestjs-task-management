import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'johndoe',
    minLength: 3,
    maxLength: 32,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'securepassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the created user',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Username of the created user',
    example: 'johndoe',
  })
  username: string;
}

export interface UserWithHashedPassword {
  id: string;
  username: string;
  passwordHash: string;
}
