import { MigrationInterface, QueryRunner } from 'typeorm';

export default class EditUserTableAdmin1670442493377
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "public"."user" ALTER COLUMN "admin" DROP DEFAULT, ALTER COLUMN "admin" TYPE BOOLEAN USING admin::BOOLEAN, ALTER COLUMN "admin" SET DEFAULT FALSE; '
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "public"."user" ALTER COLUMN "admin" DROP DEFAULT, ALTER COLUMN "admin" TYPE VARCHAR USING admin::VARCHAR, ALTER COLUMN "admin" SET DEFAULT FALSE;'
    );
  }
}
