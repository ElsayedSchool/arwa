import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoldAmountAndTotalSoldPriceToDelivery20251010205806
  implements MigrationInterface
{
  name = "AddSoldAmountAndTotalSoldPriceToDelivery20251010205806";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD "soldAmount" numeric NOT NULL DEFAULT '0'`
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD "totalSoldPrice" numeric NOT NULL DEFAULT '0'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP COLUMN "totalSoldPrice"`
    );
    await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "soldAmount"`);
  }
}
