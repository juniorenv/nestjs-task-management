import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from './user.dto';
import { v4 as uuidv4 } from 'uuid';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  private readonly users: UserDto[] = [];

  public create(user: CreateUserDto) {
    const newUser: UserDto = {
      id: uuidv4(),
      username: user.username,
      password: hashSync(user.password, 10),
    };

    this.users.push(newUser);

    return newUser;
  }

  public findByUsername(username: string): UserDto | undefined {
    return this.users.find((user) => user.username === username);
  }
}
