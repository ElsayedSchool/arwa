import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryRelations1758662998204 implements MigrationInterface {
    name = 'AddCategoryRelations1758662998204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "type" ADD "character" character varying(5)`);
        await queryRunner.query(`ALTER TABLE "type" ADD "color" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "category" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "category" ADD "character" character varying(5)`);
        await queryRunner.query(`ALTER TABLE "category" ADD "color" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "category" ADD "mainCategoryId" integer`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fa133ba1322143e1b7b9b0c75f" ON "category" ("mainCategoryId", "name") `);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_93687121db44dc2ede768252ce6" FOREIGN KEY ("mainCategoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_93687121db44dc2ede768252ce6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa133ba1322143e1b7b9b0c75f"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "mainCategoryId"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "character"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "type" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "type" DROP COLUMN "character"`);
    }

}
