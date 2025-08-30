import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { TaskEntity } from './entities/task.entity';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  username: configService.get<string>('DB_USERNAME'),
  database: configService.get<string>('DB_NAME'),
  port: +configService.getOrThrow<number>('DB_PORT'),
  password: configService.get<string>('DB_PASSWORD'),
  entities: [UserEntity, TaskEntity],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
