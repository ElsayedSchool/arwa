import { Module } from "@nestjs/common";
import { SoldController } from "./sold.controller";
import { GetAllSoldHandler } from "./Queries/getAllSold.Handler";
import { GetByIdSoldHandler } from "./Queries/getByIdSold.Handler";
import { UpsertSoldHandler } from "./Commands/upsertSold.Handler";
import { DeleteSoldHandler } from "./Commands/deleteSold.Handler";

@Module({
  controllers: [SoldController],
  providers: [
    GetAllSoldHandler,
    GetByIdSoldHandler,
    UpsertSoldHandler,
    DeleteSoldHandler,
  ],
  exports: [
    GetAllSoldHandler,
    GetByIdSoldHandler,
    UpsertSoldHandler,
    DeleteSoldHandler,
  ],
})
export class SoldModule {}
