import { Injectable } from "@nestjs/common";
import { UpdateStockService } from "../../../22-ScheduleApp/updateStock/updateStock.Service";
import { UpdateDeliveryStockCommand } from "./UpdateDeliveryStock.Command";

@Injectable()
export class UpdateDeliveryStockHandler {
  constructor(private readonly updateStockService: UpdateStockService) {}

  async handle(command: UpdateDeliveryStockCommand) {
    // Call the new carryOverStockToNextDay function and return the result
    const result = await this.updateStockService.carryOverStockToNextDay();
    return {
      success: result !== null,
      message: result
        ? "Stock carried over to next day successfully"
        : "No stock to carry over",
      data: result,
    };
  }
}
