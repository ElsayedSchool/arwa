import { Repository } from "typeorm";

/**
 * Generic base repository wrapper providing common soft-delete helpers.
 * Concrete repositories can extend this class and inject TypeORM Repository<T>.
 */
export class BaseRepository<T> {
  constructor(protected repo: Repository<T>) {}

  findActive(options?: any) {
    return this.repo.find({ where: { isDeleted: false }, ...options });
  }

  findOneActive(options: any) {
    return this.repo.findOne({ where: { isDeleted: false }, ...options });
  }

  async softDelete(id: string, deletedById?: string, deletedByName?: string) {
    await this.repo.update(
      id as any,
      {
        // @ts-ignore
        isDeleted: true,
        // @ts-ignore
        deletedAt: new Date(),
        // @ts-ignore
        deletedById: deletedById || null,
        // @ts-ignore
        deletedByName: deletedByName || null,
      } as any
    );
  }

  async restore(id: string) {
    await this.repo.update(
      id as any,
      {
        // @ts-ignore
        isDeleted: false,
        // @ts-ignore
        deletedAt: null,
        // @ts-ignore
        deletedById: null,
        // @ts-ignore
        deletedByName: null,
      } as any
    );
  }

  // expose the raw TypeORM repository if needed
  getRaw() {
    return this.repo;
  }
}
