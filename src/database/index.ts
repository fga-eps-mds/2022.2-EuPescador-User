/* eslint-disable import/prefer-default-export */
import { DataSource } from 'typeorm';

export const connection = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
  logging: false,
  extra: process.env.POSTGRES_HOST
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : { ssl: false },
});
