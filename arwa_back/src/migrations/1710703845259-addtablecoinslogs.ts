import { MigrationInterface, QueryRunner } from "typeorm";

export class Addtablecoinslogs1710703845259 implements MigrationInterface {
    name = 'Addtablecoinslogs1710703845259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "coins_logs" (
                "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                "coins" INT NOT NULL,
                "addedBy" VARCHAR NOT NULL,
                "addedTo" VARCHAR NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY ("id")
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "coins_logs";
        `);
    }

}
