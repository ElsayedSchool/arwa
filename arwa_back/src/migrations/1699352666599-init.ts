import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1699352666599 implements MigrationInterface {
  name = 'Init1699352666599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "startDate" SET DEFAULT '"2023-11-07T10:24:27.651Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "league" ALTER COLUMN "nextLeagueUpdateDate" SET DEFAULT '"2023-11-07T10:24:27.658Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "league" ALTER COLUMN "nextLeagueMatchesUpdateDate" SET DEFAULT '"2023-11-07T10:24:27.658Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "league" ALTER COLUMN "lastLeagueUpdatedMatchDate" SET DEFAULT '"2023-11-07T10:24:27.658Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "league" ALTER COLUMN "lastLeagueUpdatedMatchDate" SET DEFAULT '2023-11-07 10:10:56.6'`,
    );
    await queryRunner.query(
      `ALTER TABLE "league" ALTER COLUMN "nextLeagueMatchesUpdateDate" SET DEFAULT '2023-11-07 10:10:56.6'`,
    );
    await queryRunner.query(
      `ALTER TABLE "league" ALTER COLUMN "nextLeagueUpdateDate" SET DEFAULT '2023-11-07 10:10:56.6'`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "startDate" SET DEFAULT '2023-11-07'`,
    );
  }
}
