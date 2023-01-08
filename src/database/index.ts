/* eslint-disable import/prefer-default-export */
import { DataSource } from 'typeorm';

export const connection = new DataSource({
  type: 'postgres',
  host: 'ec2-3-211-221-185.compute-1.amazonaws.com',
  port: 5432,
  username: 'hvueocpwjpotwc',
  password: 'f70e8de4f23ec6606544c2dd8b8c07bc8c337e6fb6ba143c1ccdfbc77887fbc6',
  database: 'der86gi3t3h22l',
  entities: [`${__dirname}/**/entities/*.{ts,js}`],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
  logging: false,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
