import { Injectable } from "@nestjs/common";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";

interface DeliveryFilters {
  supplierName?: string;
  dateFilter?: string; // today|week|month|range
  from?: string; // ISO date string
  to?: string; // ISO date string
  fishType?: string; // type name
}

@Injectable()
export class GetAllDeliveryHandler {
  constructor(private readonly repo: DeliveryRepo) {}
  async handle(filters: DeliveryFilters = {}) {
    const qb = this.repo.getRaw().createQueryBuilder("d");

    // eager load items and types
    qb.leftJoinAndSelect("d.deliveryItems", "di");
    qb.leftJoinAndSelect("di.type", "type");

    // base: only not-deleted
    qb.where("d.isDeleted = :isDeleted", { isDeleted: false });

    if (filters.supplierName) {
      qb.andWhere("d.supplierName ILIKE :supplierName", {
        supplierName: `%${filters.supplierName}%`,
      });
    }

    if (filters.fishType) {
      // filter where any joined type.name matches
      qb.andWhere("type.name ILIKE :fishType", {
        fishType: `%${filters.fishType}%`,
      });
    }

    if (filters.dateFilter) {
      const now = new Date();
      if (filters.dateFilter === "today") {
        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const end = new Date(start.getTime() + 24 * 3600 * 1000);
        qb.andWhere("d.deliveryDate >= :start AND d.deliveryDate < :end", {
          start,
          end,
        });
      } else if (filters.dateFilter === "week") {
        const start = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
        qb.andWhere("d.deliveryDate >= :start", { start });
      } else if (filters.dateFilter === "month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        qb.andWhere("d.deliveryDate >= :start", { start });
      } else if (filters.dateFilter === "range") {
        if (filters.from)
          qb.andWhere("d.deliveryDate >= :from", {
            from: new Date(filters.from),
          });
        if (filters.to)
          qb.andWhere("d.deliveryDate <= :to", { to: new Date(filters.to) });
      }
    }

    qb.orderBy("d.deliveryDate", "DESC");

    const results = await qb.getMany();
    return results;
  }
}
