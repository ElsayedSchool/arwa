import { Module } from "@nestjs/common";
import { TypeController } from "./type.controller";
import { GetAllTypeHandler } from "./Queries/getAllType.Handler";
import { GetByIdTypeHandler } from "./Queries/getByIdType.Handler";
import { UpsertTypeHandler } from "./Commands/upsertType.Handler";
import { DeleteTypeHandler } from "./Commands/deleteType.Handler";

@Module({
  controllers: [TypeController],
  providers: [
    GetAllTypeHandler,
    GetByIdTypeHandler,
    UpsertTypeHandler,
    DeleteTypeHandler,
  ],
  exports: [
    GetAllTypeHandler,
    GetByIdTypeHandler,
    UpsertTypeHandler,
    DeleteTypeHandler,
  ],
})
export class TypeModule {}
