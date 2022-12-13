import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AlterUserSuperAdmin1670448186198
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "public"."user" ALTER COLUMN "superAdmin" DROP DEFAULT, ALTER COLUMN "superAdmin" TYPE BOOLEAN USING "superAdmin"::BOOLEAN, ALTER COLUMN "superAdmin" SET DEFAULT FALSE; '
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "public"."user" ALTER COLUMN "superAdmin" DROP DEFAULT, ALTER COLUMN "superAdmin" TYPE VARCHAR USING "superAdmin"::VARCHAR, ALTER COLUMN "admin" SET DEFAULT FALSE;'
    );
  }
}
