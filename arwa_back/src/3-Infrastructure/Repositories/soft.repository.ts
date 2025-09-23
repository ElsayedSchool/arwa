import { Repository, FindManyOptions, FindOneOptions } from "typeorm";

// Generic soft-delete repository helpers. Use by extending or composing with a TypeORM Repository<T>.
export class SoftRepository<
  T extends { id: any; isDeleted?: boolean; deletedAt?: Date | null },
> {
  constructor(private repo: Repository<T>) {}

  // find non-deleted rows
  findActive(options?: FindManyOptions<T>) {
    const where = { ...(options?.where as object), isDeleted: false } as any;
    const opts: FindManyOptions<T> = { ...options, where };
    return this.repo.find(opts);
  }

  findOneActive(options?: FindOneOptions<T>) {
    const where = { ...(options?.where as object), isDeleted: false } as any;
    const opts: FindOneOptions<T> = { ...options, where };
    return this.repo.findOne(opts as any);
  }

  // soft-delete by id (set isDeleted=true and deletedAt timestamp)
  async softDelete(id: any) {
    const entity = await this.repo.findOneBy({ id } as any);
    if (!entity) return null;
    (entity as any).isDeleted = true;
    (entity as any).deletedAt = new Date();
    return this.repo.save(entity);
  }

  // restore a soft-deleted entity
  async restore(id: any) {
    const entity = await this.repo.findOneBy({ id } as any);
    if (!entity) return null;
    (entity as any).isDeleted = false;
    (entity as any).deletedAt = null;
    return this.repo.save(entity);
  }

  // helper to create a query builder that filters out deleted rows by default
  createQueryBuilderActive(alias: string) {
    return this.repo
      .createQueryBuilder(alias)
      .where(`${alias}.isDeleted = :isDeleted`, { isDeleted: false });
  }
}
