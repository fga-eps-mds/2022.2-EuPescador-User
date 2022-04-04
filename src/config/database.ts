import { DataSource } from 'typeorm'
import { User } from '../models/user';

export const connection =  new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "root",
  password: "admin",
  database: "user",
  entities: [User],
  synchronize: true,
  logging: false
});
