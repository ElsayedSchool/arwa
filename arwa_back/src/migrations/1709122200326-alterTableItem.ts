import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableItem1709122200326 implements MigrationInterface {
    name = 'AlterTableItem1709122200326'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "item" ADD "esName" character varying(30) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "item" ADD "poName" character varying(30) NOT NULL DEFAULT ''`);
 }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE item DROP COLUMN poName");
        await queryRunner.query("ALTER TABLE item DROP COLUMN esName");


}

}
