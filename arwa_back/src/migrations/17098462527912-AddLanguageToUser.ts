import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLanguageToUser1709846252791 implements MigrationInterface {
    name = 'AddLanguageToUser17098462527912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD COLUMN "language" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "language"`);
    }

}
