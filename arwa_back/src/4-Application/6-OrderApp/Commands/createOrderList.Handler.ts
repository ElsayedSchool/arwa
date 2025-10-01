import { Injectable } from "@nestjs/common";
import { CreateOrderListCommand } from "./createOrderList.Command";
import { CustomerRepo, OrderRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class CreateOrderListHandler {
  constructor(
    private repo: OrderRepo,
    private customerRepo: CustomerRepo
  ) {}
  async execute(cmd: CreateOrderListCommand) {
    // determine today's range
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    // check if any orders exist for today
    const todayCount = await this.repo
      .getRaw()
      .createQueryBuilder("order")
      .where("order.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere("order.createAt >= :start", { start: startOfDay })
      .andWhere("order.createAt <= :end", { end: endOfDay })
      .getCount();

    if (todayCount === 0) {
      // Get all active customers
      const customers = await this.customerRepo.findActive();

      // Create an order for each customer
      const orders = customers.map((customer) => ({
        customerId: customer.id,
        customerName: customer.name,
        totalPrice: 0,
      }));

      if (orders.length > 0) {
        await this.repo.getRaw().save(orders);
      }
    }

    // return today's orders (with relations)
    const todayOrders = await this.repo
      .getRaw()
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.customer", "customer")
      .leftJoinAndSelect("order.orderItems", "orderItems")
      .leftJoinAndSelect("orderItems.fishType", "fishType")
      .where("order.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere("order.createAt >= :start", { start: startOfDay })
      .andWhere("order.createAt <= :end", { end: endOfDay })
      .orderBy("order.createAt", "DESC")
      .getMany();

    return todayOrders;
  }
}
