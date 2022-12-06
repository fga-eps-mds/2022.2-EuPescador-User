/* eslint-disable camelcase */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('token')
export default class Token {
  @PrimaryGeneratedColumn('increment')
  id?: string;

  @Column({ nullable: true })
  value?: string;

  @Column({ nullable: true })
  user_id?: string;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
