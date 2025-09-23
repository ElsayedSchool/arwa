import { Module } from "@nestjs/common";
import { TruckController } from "./truck.controller";
import { GetAllTruckHandler } from "./Queries/getAllTruck.Handler";
import { GetByIdTruckHandler } from "./Queries/getByIdTruck.Handler";
import { UpsertTruckHandler } from "./Commands/upsertTruck.Handler";
import { DeleteTruckHandler } from "./Commands/deleteTruck.Handler";

@Module({
  controllers: [TruckController],
  providers: [
    GetAllTruckHandler,
    GetByIdTruckHandler,
    UpsertTruckHandler,
    DeleteTruckHandler,
  ],
  exports: [
    GetAllTruckHandler,
    GetByIdTruckHandler,
    UpsertTruckHandler,
    DeleteTruckHandler,
  ],
})
export class TruckModule {}
