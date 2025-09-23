import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOfferNameLocalizationColumns1709026191554 implements MigrationInterface {
    name = 'AddOfferNameLocalizationColumns17090261915545';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE sponsor ADD COLUMN poName varchar(30) DEFAULT ''");
        await queryRunner.query("ALTER TABLE sponsor ADD COLUMN esName varchar(30) DEFAULT ''");
        await queryRunner.query("ALTER TABLE advertisement ADD COLUMN poCompanyName varchar(20) DEFAULT ''");
        await queryRunner.query("ALTER TABLE advertisement ADD COLUMN esCompanyName varchar(20) DEFAULT ''");
        await queryRunner.query("ALTER TABLE advertisement ADD COLUMN esDescription varchar(50) DEFAULT ''");
        await queryRunner.query("ALTER TABLE advertisement ADD COLUMN poDescription varchar(50) DEFAULT ''");
        // await queryRunner.query("ALTER TABLE item ADD COLUMN poName varchar(30) DEFAULT ''");
        // await queryRunner.query("ALTER TABLE item ADD COLUMN esName varchar(30) DEFAULT ''");

        // await queryRunner.query("ALTER TABLE coin_offer ADD COLUMN arOfferName varchar(255)");
        // await queryRunner.query("ALTER TABLE coin_offer ADD COLUMN esOfferName varchar(255)");
        // await queryRunner.query("ALTER TABLE coin_offer ADD COLUMN poOfferName varchar(255)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE sponsor DROP COLUMN poName");
        await queryRunner.query("ALTER TABLE sponsor DROP COLUMN esName");
        await queryRunner.query("ALTER TABLE advertisement DROP COLUMN poCompanyName");
        await queryRunner.query("ALTER TABLE advertisement DROP COLUMN esCompanyName");
        await queryRunner.query("ALTER TABLE advertisement DROP COLUMN esDescription");
        await queryRunner.query("ALTER TABLE advertisement DROP COLUMN poDescription");
        // await queryRunner.query("ALTER TABLE item DROP COLUMN poName");
        // await queryRunner.query("ALTER TABLE item DROP COLUMN esName");
        // await queryRunner.query("ALTER TABLE coin_offer DROP COLUMN arOfferName");
        // await queryRunner.query("ALTER TABLE coin_offer DROP COLUMN esOfferName");
        // await queryRunner.query("ALTER TABLE coin_offer DROP COLUMN poOfferName");
    }
}
