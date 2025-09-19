import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserResponseDto } from './user.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerError } from 'src/common/decorators/api-common-responses.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user account with username and password.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data - validation errors',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'username must be shorter than or equal to 32 characters',
            'username must be longer than or equal to 3 characters',
            'username must be a string',
            'password must be longer than or equal to 6 characters',
            'password must be a string',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Username already exists - duplicate user',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User johndoe already registered.',
        },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @ApiInternalServerError()
  public async create(
    @Body() user: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return await this.userService.create(user);
  }
}
