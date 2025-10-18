import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { UpdateDeliveryStockHandler } from "./Commands/UpdateDeliveryStock/UpdateDeliveryStock.Handler";
import { GetAggregatedStockHandler } from "./Queries/GetAggregatedStock/GetAggregatedStock.Handler";
import { GetStockOfDayHandler } from "./Queries/getStockOfDay.Handler";
import { UpdateDeliveryStockCommand } from "./Commands/UpdateDeliveryStock/UpdateDeliveryStock.Command";
import { GetAggregatedStockQuery } from "./Queries/GetAggregatedStock/GetAggregatedStock.Query";
import { GetStockOfDayQuery } from "./Queries/getStockOfDay.Query";

@Controller("inventory-movement")
export class InventoryMovementController {
  constructor(
    private readonly updateDeliveryStock: UpdateDeliveryStockHandler,
    private readonly getAggregatedStock: GetAggregatedStockHandler,
    private readonly getStockOfDayHandler: GetStockOfDayHandler
  ) {}

  @Post("update-delivery-stock")
  async updateDeliveryStockEndpoint(@Body() body: any) {
    return this.updateDeliveryStock.handle(
      new UpdateDeliveryStockCommand(body)
    );
  }

  @Get("aggregated-stock")
  async getAggregatedStockEndpoint() {
    // Get aggregated stock for all suppliers with isStock = true
    return this.getAggregatedStock.handle(
      new GetAggregatedStockQuery("", true)
    );
  }

  @Get("stock-of-day")
  async getStockOfDay(@Query("date") date: string) {
    const targetDate = new Date(date);
    return this.getStockOfDayHandler.handle(new GetStockOfDayQuery(targetDate));
  }
}
