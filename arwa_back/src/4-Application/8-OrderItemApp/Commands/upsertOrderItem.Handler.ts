import { Injectable } from "@nestjs/common";
import { UpsertOrderItemCommand } from "./upsertOrderItem.Command";
import { OrderItemRepo, OrderRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class UpsertOrderItemHandler {
  constructor(
    private repo: OrderItemRepo,
    private orderRepo: OrderRepo
  ) {}
  async execute(cmd: UpsertOrderItemCommand) {
    const saved = await this.repo.getRaw().save(cmd.payload);

    try {
      const orderId = saved.orderId || cmd.payload.orderId;
      if (orderId) {
        const items = await this.repo.getRaw().find({ where: { orderId } });
        const allPriced = items.every((i) => Number(i.pricePerKilo) > 0);
        const total = items.reduce((s, i) => s + Number(i.totalPrice || 0), 0);
        await this.orderRepo
          .getRaw()
          .update({ id: orderId }, { totalPrice: total });
        // If you later add an isPaid / priced flag, you can set it here when allPriced is true
      }
    } catch (e) {
      // log and continue
      console.error("Failed to recalc order totals after upsert item:", e);
    }

    return saved;
  }
}
