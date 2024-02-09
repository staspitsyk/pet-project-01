import { DataSource, DataSourceOptions } from 'typeorm';

import { config } from '../config/configuration';

export const dataSourceOptions: DataSourceOptions = {
  type: config.database.postgres.type,
  host: config.database.postgres.host,
  port: config.database.postgres.port,
  username: config.database.postgres.username,
  password: config.database.postgres.password,
  database: config.database.postgres.database,
  logging: true,
  entities: config.database.postgres.entities,
  migrations: ['dist/db/migrations/*.js'],
  synchronize: config.database.postgres.synchronize,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
