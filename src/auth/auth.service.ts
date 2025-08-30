import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto, JwtPayload } from './auth.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtExpirationTime: number;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTime = +this.configService.getOrThrow<number>(
      'JWT_EXPIRATION_TIME',
    );
  }
  public async signIn(
    username: string,
    password: string,
  ): Promise<AuthResponseDto> {
    const foundUser = await this.userService.findByUsername(username);

    if (!foundUser || !compareSync(password, foundUser.password)) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = {
      sub: foundUser.id,
      username: foundUser.username,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      expiresIn: this.jwtExpirationTime,
    };
  }
}
