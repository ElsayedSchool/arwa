import { Injectable } from "@nestjs/common";
import { Order } from "src/2-Domain/Entities";
import { OrderRepo } from "src/3-Infrastructure/Repositories";
import { GetCustomerOrdersQuery } from "./getCustomerOrders.Query";

@Injectable()
export class GetCustomerOrdersQueryHandler {
  constructor(private orderRepo: OrderRepo) {}

  async handle(query: GetCustomerOrdersQuery): Promise<Order[]> {
    const { customerId, startDate, endDate, exactDate } = query.filter;

    const qb = this.orderRepo
      .getRaw()
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.orderItems", "items")
      .where("order.customerId = :customerId", { customerId });

    if (exactDate) {
      qb.andWhere("DATE(order.date) = :exactDate", { exactDate });
    } else {
      if (startDate) qb.andWhere("order.date >= :startDate", { startDate });
      if (endDate) qb.andWhere("order.date <= :endDate", { endDate });
    }

    return await qb.getMany();
  }
}
