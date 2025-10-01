import { Injectable } from "@nestjs/common";
import { OrderRepo } from "src/3-Infrastructure/Repositories";
import { GetAllOrderQuery } from "./getAllOrder.Query";

@Injectable()
export class GetAllOrderHandler {
  constructor(private readonly repo: OrderRepo) {}

  async handle(query: GetAllOrderQuery = new GetAllOrderQuery()) {
    const { dateFilter, dateFrom, dateTo } = query;

    if (!dateFilter || dateFilter === "all") {
      return this.repo.findActive();
    }

    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    switch (dateFilter) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "range":
        if (dateFrom) {
          startDate = new Date(dateFrom);
        }
        if (dateTo) {
          endDate = new Date(dateTo);
          endDate.setHours(23, 59, 59, 999); // End of day
        }
        break;
      default:
        return this.repo.findActive();
    }

    if (!startDate) {
      return this.repo.findActive();
    }

    // Use TypeORM query builder to filter by date range
    const queryBuilder = this.repo
      .getRaw()
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.customer", "customer")
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.fishType", "fishType")
      // NOTE: The relation on OrderItem is named "Supplier" (capital S) in the entity,
      // but we don't need to join it unless the client needs supplier details.
      // Joining here was causing: "Relation with property path supplier in entity was not found".
      .where("order.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere("order.createAt >= :startDate", { startDate })
      .andWhere("order.createAt <= :endDate", { endDate })
      .orderBy("order.createAt", "DESC");

    return queryBuilder.getMany();
  }
}
