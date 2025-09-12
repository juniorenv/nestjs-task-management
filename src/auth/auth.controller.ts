import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(loginDto.username, loginDto.password);
  }
}
