import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserResponseDto,
  UserWithHashedPassword,
} from './user.dto';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async create(user: CreateUserDto): Promise<CreateUserResponseDto> {
    const userAlreadyRegistered = await this.findByUsername(user.username);

    if (userAlreadyRegistered) {
      throw new ConflictException(`User ${user.username} already registered.`);
    }

    const dbUser = this.usersRepository.create({
      username: user.username,
      passwordHash: await hash(user.password, 10),
    });

    const { id, username } = await this.usersRepository.save(dbUser);

    return { id, username };
  }

  public async findByUsername(
    username: string,
  ): Promise<UserWithHashedPassword | null> {
    const foundUser = await this.usersRepository.findOne({
      where: { username },
    });

    if (!foundUser) {
      return null;
    }

    return {
      id: foundUser.id,
      username: foundUser.username,
      passwordHash: foundUser.passwordHash,
    };
  }
}
