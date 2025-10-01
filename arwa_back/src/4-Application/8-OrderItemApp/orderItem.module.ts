import { Module } from "@nestjs/common";
import { OrderItemController } from "./orderItem.controller";
import { GetAllOrderItemHandler } from "./Queries/getAllOrderItem.Handler";
import { GetByIdOrderItemHandler } from "./Queries/getByIdOrderItem.Handler";
import { UpsertOrderItemHandler } from "./Commands/upsertOrderItem.Handler";
import { DeleteOrderItemHandler } from "./Commands/deleteOrderItem.Handler";
import { RepositoryModule } from "src/3-Infrastructure/Repositories/repository.module";

@Module({
  imports: [RepositoryModule],
  controllers: [OrderItemController],
  providers: [
    GetAllOrderItemHandler,
    GetByIdOrderItemHandler,
    UpsertOrderItemHandler,
    DeleteOrderItemHandler,
  ],
  exports: [
    GetAllOrderItemHandler,
    GetByIdOrderItemHandler,
    UpsertOrderItemHandler,
    DeleteOrderItemHandler,
  ],
})
export class OrderItemModule {}
