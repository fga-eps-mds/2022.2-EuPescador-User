/* eslint-disable import/prefer-default-export */
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('user')
export default class User {
  @PrimaryColumn()
  id?: string;

  @Column()
  name?: string;

  @Column()
  email?: string;

  @Column()
  phone?: string;

  @Column()
  password?: string;

  @Column()
  admin?: boolean;

  @Column()
  state?: string;

  @Column()
  city?: string;

  @Column()
  superAdmin?: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }

    if (!this.admin) {
      this.admin = false;
    }

    if (!this.superAdmin) {
      this.superAdmin = false;
    }
  }
}
