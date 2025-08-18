import './boilerplate.polyfill';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { UserSubscriber } from './entity-subscribers/user-subscriber';
import { SnakeNamingStrategy } from './snake-naming.strategy';

dotenv.config();
const isProd = process.env.NODE_ENV === 'production';
export const dataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  subscribers: [UserSubscriber],
  synchronize: false,
  migrationsRun: false,
  entities: isProd
    ? ['dist/modules/**/*.entity.js', 'dist/modules/**/*.view-entity.js']
    : ['modules/**/*.entity.ts', 'modules/**/*.view-entity.ts'],
  migrations: isProd
    ? ['dist/database/migrations/*.js']
    : ['database/migrations/*.ts'],
});
