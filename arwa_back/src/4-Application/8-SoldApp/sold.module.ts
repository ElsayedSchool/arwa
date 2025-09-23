import { Module } from "@nestjs/common";
import { SoldController } from "./sold.controller";

@Module({
  controllers: [SoldController],
})
export class SoldModule {}
