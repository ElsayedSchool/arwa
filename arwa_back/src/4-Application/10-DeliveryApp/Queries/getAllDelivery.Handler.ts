import { Injectable } from "@nestjs/common";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";

interface DeliveryFilters {
  supplierName?: string;
  dateFilter?: string; // today|week|month|range
  from?: string; // ISO date string
  to?: string; // ISO date string
  fishType?: string; // type name
  baseType?: string; // base type category
}

@Injectable()
export class GetAllDeliveryHandler {
  constructor(private readonly repo: DeliveryRepo) {}
  async handle(filters: DeliveryFilters = {}) {
    const qb = this.repo.getRaw().createQueryBuilder("d");

    // eager load items and types
    qb.leftJoinAndSelect("d.deliveryItems", "di");
    qb.leftJoinAndSelect("di.type", "type");
    qb.leftJoin("type.mainCategory", "mainCategory");

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

    if (filters.baseType) {
      // filter where any joined type.mainCategory matches
      qb.andWhere("mainCategory.name ILIKE :baseType", {
        baseType: `%${filters.baseType}%`,
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

    // Transform to DeliveryUi format
    return results.map((delivery) => ({
      id: delivery.id,
      supplierName: delivery.supplierName,
      driverName: delivery.driverName,
      deliveryDate: delivery.deliveryDate.toISOString().split("T")[0],
      deliveryTime: delivery.deliveryDate
        .toISOString()
        .split("T")[1]
        .substring(0, 5),
      lastEditTime: delivery.lastUpdated?.toISOString() || null,
      totalWeight:
        delivery.deliveryItems?.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        ) || 0,
      paymentStatus:
        delivery.totalDue === 0
          ? "paid"
          : delivery.totalPaid > 0
            ? "partial"
            : "unpaid",
      totalCost: delivery.totalPrice,
      amountPaid: delivery.totalPaid,
      remainingAmount: delivery.totalDue,
      fishTypes:
        delivery.deliveryItems?.map((item) => ({
          id: item.id,
          type: item.type?.name || "",
          category: item.type?.mainCategory?.name || item.type?.name || "",
          weight: Number(item.amount),
          pricePerKg: Number((item as any).pricePerKilo ?? 0),
        })) || [],
    }));
  }
}
