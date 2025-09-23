import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { GetAllInventoryHandler } from "./Queries/getAllInventory.Handler";
import { GetByIdInventoryHandler } from "./Queries/getByIdInventory.Handler";
import { UpsertInventoryHandler } from "./Commands/upsertInventory.Handler";
import { DeleteInventoryHandler } from "./Commands/deleteInventory.Handler";

@Module({
  controllers: [InventoryController],
  providers: [
    GetAllInventoryHandler,
    GetByIdInventoryHandler,
    UpsertInventoryHandler,
    DeleteInventoryHandler,
  ],
  exports: [
    GetAllInventoryHandler,
    GetByIdInventoryHandler,
    UpsertInventoryHandler,
    DeleteInventoryHandler,
  ],
})
export class InventoryModule {}
