/* eslint-disable camelcase */
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('token')
export default class Token {
  @PrimaryColumn()
  id?: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column()
  expires_at?: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}
