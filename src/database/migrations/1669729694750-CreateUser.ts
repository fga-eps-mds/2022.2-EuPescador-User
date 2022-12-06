import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUser1669729694750 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'email', type: 'varchar' },
          { name: 'phone', type: 'varchar' },
          { name: 'password', type: 'varchar' },
          { name: 'state', type: 'varchar' },
          { name: 'city', type: 'varchar' },
          { name: 'admin', type: 'varchar' },
          { name: 'superAdmin', type: 'varchar' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
