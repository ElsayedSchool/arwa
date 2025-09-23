import { Module } from "@nestjs/common";
import { TruckItemController } from "./truckItem.controller";
import { GetAllTruckItemHandler } from "./Queries/getAllTruckItem.Handler";
import { GetByIdTruckItemHandler } from "./Queries/getByIdTruckItem.Handler";
import { UpsertTruckItemHandler } from "./Commands/upsertTruckItem.Handler";
import { DeleteTruckItemHandler } from "./Commands/deleteTruckItem.Handler";

@Module({
  controllers: [TruckItemController],
  providers: [
    GetAllTruckItemHandler,
    GetByIdTruckItemHandler,
    UpsertTruckItemHandler,
    DeleteTruckItemHandler,
  ],
  exports: [
    GetAllTruckItemHandler,
    GetByIdTruckItemHandler,
    UpsertTruckItemHandler,
    DeleteTruckItemHandler,
  ],
})
export class TruckItemModule {}
