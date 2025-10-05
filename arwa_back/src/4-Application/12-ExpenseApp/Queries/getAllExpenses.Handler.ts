import { Injectable } from "@nestjs/common";
import { ExpenseRepo } from "src/3-Infrastructure/Repositories";

interface ExpenseFilters {
  dateFilter?: string; // today|week|month|range
  from?: string; // ISO date string
  to?: string; // ISO date string
  name?: string;
  description?: string;
}

@Injectable()
export class GetAllExpensesHandler {
  constructor(private readonly repo: ExpenseRepo) {}

  async handle(filters: ExpenseFilters = {}) {
    const qb = this.repo.getRaw().createQueryBuilder("e");

    // base: only not-deleted
    qb.where("e.isDeleted = :isDeleted", { isDeleted: false });

    if (filters.dateFilter) {
      const now = new Date();
      if (filters.dateFilter === "today") {
        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const end = new Date(start.getTime() + 24 * 3600 * 1000);
        qb.andWhere("e.createdAt >= :start AND e.createdAt < :end", {
          start,
          end,
        });
      } else if (filters.dateFilter === "week") {
        const start = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
        qb.andWhere("e.createdAt >= :start", { start });
      } else if (filters.dateFilter === "month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        qb.andWhere("e.createdAt >= :start", { start });
      } else if (filters.dateFilter === "range") {
        if (filters.from)
          qb.andWhere("e.createdAt >= :from", {
            from: new Date(filters.from),
          });
        if (filters.to)
          qb.andWhere("e.createdAt <= :to", { to: new Date(filters.to) });
      }
    }

    if (filters.name) {
      qb.andWhere("e.name ILIKE :name", { name: `%${filters.name}%` });
    }

    if (filters.description) {
      qb.andWhere("e.description ILIKE :description", {
        description: `%${filters.description}%`,
      });
    }

    if (filters.name) {
      qb.andWhere("e.name ILIKE :name", { name: `%${filters.name}%` });
    }

    if (filters.description) {
      qb.andWhere("e.description ILIKE :description", {
        description: `%${filters.description}%`,
      });
    }

    qb.orderBy("e.createdAt", "DESC");

    const results = await qb.getMany();

    return results.map((expense) => ({
      id: expense.id,
      name: expense.name,
      description: expense.description,
      price: expense.price,
      createdAt: expense.createdAt.toISOString(),
    }));
  }
}
