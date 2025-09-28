import { MigrationInterface, QueryRunner } from "typeorm";

export class addPhoneToUserProfile1759058400000 implements MigrationInterface {
  name = "addPhoneToUserProfile1759058400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD COLUMN "phoneNumber" character varying(20)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_profile" DROP COLUMN "phoneNumber"`
    );
  }
}
