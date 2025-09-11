import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponseDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async create(
    @Body() user: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return await this.userService.create(user);
  }
}
