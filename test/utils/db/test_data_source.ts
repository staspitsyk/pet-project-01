import { DataSourceOptions } from 'typeorm';

export const testDataSourceOptions: DataSourceOptions = {
  password: '123',
  host: 'localhost',
  type: 'postgres',
  username: 'postgres',
  port: 5435,
  synchronize: true,
  entities: ['src/**/*.entity.ts'],
};
