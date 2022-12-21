import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddColumnExpiresAt1671339430709
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "public"."token" ADD COLUMN "expires_at" TIMESTAMP;'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "public"."token" DROP COLUMN "expires_at";'
    );
  }
}
