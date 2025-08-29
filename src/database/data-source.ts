import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const configService = new ConfigService();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  username: configService.get<string>('DB_USERNAME'),
  database: configService.get<string>('DB_NAME'),
  port: +configService.getOrThrow<number>('DB_PORT'),
  password: configService.get<string>('DB_PASSWORD'),
  entities: [],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
