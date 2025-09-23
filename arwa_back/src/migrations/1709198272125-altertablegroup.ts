import { MigrationInterface, QueryRunner } from "typeorm";

export class Altertablegroup1709198272125 implements MigrationInterface {
    name = 'Altertablegroup1709198272125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" ADD "arDescription" varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "group" ADD "esDescription" varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "group" ADD "poDescription" varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "group" ADD "arName" varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "group" ADD "esName" varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "group" ADD "poName" varchar(255) NOT NULL DEFAULT ''`);

        // await queryRunner.query(`CREATE UNIQUE INDEX "IDX_arName" ON "group" ("arName")`);
        // await queryRunner.query(`CREATE UNIQUE INDEX "IDX_esName" ON "group" ("esName")`);
        // await queryRunner.query(`CREATE UNIQUE INDEX "IDX_poName" ON "group" ("poName")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`DROP INDEX "IDX_arName"`);
        // await queryRunner.query(`DROP INDEX "IDX_esName"`);
        // await queryRunner.query(`DROP INDEX "IDX_poName"`);

        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "arDescription"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "esDescription"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "poDescription"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "arName"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "esName"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "poName"`);
    }


}
