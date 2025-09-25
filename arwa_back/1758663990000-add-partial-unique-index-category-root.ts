import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPartialUniqueIndexCategoryRoot1758663990000
  implements MigrationInterface
{
  name = "AddPartialUniqueIndexCategoryRoot1758663990000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // create a partial unique index to ensure top-level categories (mainCategoryId IS NULL) have unique names
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_category_root_name" ON "category" ("name") WHERE "mainCategoryId" IS NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_category_root_name"`);
  }
}
