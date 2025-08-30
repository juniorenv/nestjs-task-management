export class UserDto {
  id: string;
  username: string;
  password: string;
}

export class CreateUserDto {
  username: string;
  password: string;
}

export interface CreateUserResponse {
  id: string;
  username: string;
}
