import { Module } from "@nestjs/common";
import { InventoryMovementController } from "./inventoryMovement.controller";
import { UpdateDeliveryStockHandler } from "./Commands/UpdateDeliveryStock/UpdateDeliveryStock.Handler";
import { GetAggregatedStockHandler } from "./Queries/GetAggregatedStock/GetAggregatedStock.Handler";
import { GetStockOfDayHandler } from "./Queries/getStockOfDay.Handler";
import { UpdateStockService } from "../22-ScheduleApp/updateStock/updateStock.Service";

@Module({
  controllers: [InventoryMovementController],
  providers: [
    UpdateDeliveryStockHandler,
    GetAggregatedStockHandler,
    GetStockOfDayHandler,
    UpdateStockService,
  ],
  exports: [
    UpdateDeliveryStockHandler,
    GetAggregatedStockHandler,
    GetStockOfDayHandler,
  ],
})
export class InventoryMovementModule {}
