import { Module } from "@nestjs/common";
import { TruckController } from "./truck.controller";

@Module({
  controllers: [TruckController],
})
export class TruckModule {}
