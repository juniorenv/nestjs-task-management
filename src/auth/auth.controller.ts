import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from './auth.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiUnauthorized,
  ApiInternalServerError,
} from 'src/common/decorators/api-common-responses.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Authentication',
    description: 'Authenticate a user and receive a JWT token',
  })
  @ApiOkResponse({
    description: 'Login successful - JWT token generated',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data - validation failed',
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
  @ApiUnauthorized()
  @ApiInternalServerError()
  public async signIn(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(loginDto.username, loginDto.password);
  }
}
