export class AuthResponseDto {
  token: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  username: string;
}
