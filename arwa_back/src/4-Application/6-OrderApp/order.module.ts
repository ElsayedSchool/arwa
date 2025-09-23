import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { GetAllOrderHandler } from "./Queries/getAllOrder.Handler";
import { GetByIdOrderHandler } from "./Queries/getByIdOrder.Handler";
import { UpsertOrderHandler } from "./Commands/upsertOrder.Handler";
import { DeleteOrderHandler } from "./Commands/deleteOrder.Handler";

@Module({
  controllers: [OrderController],
  providers: [
    GetAllOrderHandler,
    GetByIdOrderHandler,
    UpsertOrderHandler,
    DeleteOrderHandler,
  ],
  exports: [
    GetAllOrderHandler,
    GetByIdOrderHandler,
    UpsertOrderHandler,
    DeleteOrderHandler,
  ],
})
export class OrderModule {}
