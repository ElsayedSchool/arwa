import { Module } from "@nestjs/common";
import { SupplierController } from "./supplier.controller";
import { GetAllSupplierHandler } from "./Queries/getAllSupplier.Handler";
import { GetByIdSupplierHandler } from "./Queries/getByIdSupplier.Handler";
import { UpsertSupplierHandler } from "./Commands/upsertSupplier.Handler";
import { DeleteSupplierHandler } from "./Commands/deleteSupplier.Handler";

@Module({
  controllers: [SupplierController],
  providers: [
    GetAllSupplierHandler,
    GetByIdSupplierHandler,
    UpsertSupplierHandler,
    DeleteSupplierHandler,
  ],
  exports: [
    GetAllSupplierHandler,
    GetByIdSupplierHandler,
    UpsertSupplierHandler,
    DeleteSupplierHandler,
  ],
})
export class SupplierModule {}
