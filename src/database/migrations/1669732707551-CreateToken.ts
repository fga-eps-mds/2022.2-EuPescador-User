import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateToken1669732707551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'token',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'value', type: 'varchar' },
          { name: 'user_id', type: 'uuid' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('token');
  }
}
