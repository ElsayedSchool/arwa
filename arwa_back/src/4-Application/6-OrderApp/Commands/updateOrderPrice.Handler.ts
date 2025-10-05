import { Injectable } from "@nestjs/common";
import { OrderRepo } from "src/3-Infrastructure/Repositories";
import { UpdateOrderPriceCommand } from "./updateOrderPrice.Command";

@Injectable()
export class UpdateOrderPriceHandler {
  constructor(private readonly repo: OrderRepo) {}

  async execute(cmd: UpdateOrderPriceCommand) {
    const { orderId, priceData } = cmd;

    // Get the current order
    const order = await this.repo.getRaw().findOne({
      where: { id: orderId, isDeleted: false },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Update the price field
    const updateData: any = {};

    if (priceData.totalPrice !== undefined) {
      updateData.totalPrice = priceData.totalPrice;
    }

    // Update the order
    await this.repo.getRaw().update(orderId, updateData);

    // Return the updated order
    return this.repo.getRaw().findOne({
      where: { id: orderId, isDeleted: false },
    });
  }
}
