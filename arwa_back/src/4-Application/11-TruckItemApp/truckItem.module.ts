import { Module } from "@nestjs/common";
import { TruckItemController } from "./truckItem.controller";

@Module({
  controllers: [TruckItemController],
})
export class TruckItemModule {}
