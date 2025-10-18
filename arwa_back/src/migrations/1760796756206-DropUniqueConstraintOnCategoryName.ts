import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUniqueConstraintOnCategoryName1760796756206
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint on category name
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_23c05c292c439d77b0de816b50"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the unique constraint on category name
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_23c05c292c439d77b0de816b50" ON "category" ("name")`
    );
  }
}
