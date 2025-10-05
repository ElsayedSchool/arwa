import { Injectable } from "@nestjs/common";
import { OrderRepo } from "src/3-Infrastructure/Repositories";
import { UpdateOrderFinancialCommand } from "./updateOrderFinancial.Command";

@Injectable()
export class UpdateOrderFinancialHandler {
  constructor(private readonly repo: OrderRepo) {}

  async execute(cmd: UpdateOrderFinancialCommand) {
    const { orderId, financialData } = cmd;

    // Get the current order
    const order = await this.repo.getRaw().findOne({
      where: { id: orderId, isDeleted: false },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Update only the financial fields
    const updateData: any = {};

    if (financialData.totalDebt !== undefined) {
      updateData.totalDebt = financialData.totalDebt;
    }

    if (financialData.paid !== undefined) {
      // Accumulate payments instead of replacing
      updateData.paid = (order.paid || 0) + financialData.paid;
    }

    if (financialData.discount !== undefined) {
      // Accumulate discounts instead of replacing
      updateData.discount = (order.discount || 0) + financialData.discount;
    }

    if (financialData.updatedDebt !== undefined) {
      updateData.updatedDebt = financialData.updatedDebt;
    }

    // Update the order
    await this.repo.getRaw().update(orderId, updateData);

    // Return the updated order
    return this.repo.getRaw().findOne({
      where: { id: orderId, isDeleted: false },
    });
  }
}
