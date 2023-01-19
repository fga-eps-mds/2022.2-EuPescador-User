import { MigrationInterface, QueryRunner } from "typeorm"

export default class DropColumnValue1674100057000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "public"."token" DROP COLUMN "value";`
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "public"."token" ADD "value" VARCHAR(255)`
          );
    }

}
