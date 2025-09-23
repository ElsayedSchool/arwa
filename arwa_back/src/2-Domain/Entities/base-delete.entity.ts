import { Column } from "typeorm";

/**
 * Base entity for soft-delete/audit fields.
 * Other entities should extend this class.
 */
export abstract class BaseDelete {
  // Do not declare a primary column here. Each concrete entity must declare its own primary key (e.g. `id`).
  // This prevents TypeORM from generating unexpected PKs on child tables which can break FK creation.
  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @Column({ nullable: true })
  deletedById: string | null;

  @Column({ length: 200, nullable: true })
  deletedByName: string | null;

  // Note: we intentionally do not create an ORM relation here to avoid circular imports.
  // Repositories or services can join to `UserProfile` manually when needed.
}
