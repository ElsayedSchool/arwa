import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "../../2-Domain/Entities";
import { OrderItem } from "../../2-Domain/Entities";
import { Supplier } from "../../2-Domain/Entities";
import { Category } from "../../2-Domain/Entities";
import { RepositoryModule } from "../../3-Infrastructure/Repositories/repository.module";
import { OrderController } from "./order.controller";
import { GetAllOrderHandler } from "./Queries/getAllOrder.Handler";
import { GetByIdOrderHandler } from "./Queries/getByIdOrder.Handler";
import { UpsertOrderHandler } from "./Commands/upsertOrder.Handler";
import { DeleteOrderHandler } from "./Commands/deleteOrder.Handler";
import { CreateOrderListHandler } from "./Commands/createOrderList.Handler";
import { UpdateOrderItemsHandler } from "./Commands/updateOrderItems.Handler";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Supplier, Category]),
    RepositoryModule,
  ],
  controllers: [OrderController],
  providers: [
    GetAllOrderHandler,
    GetByIdOrderHandler,
    UpsertOrderHandler,
    UpdateOrderItemsHandler,
    DeleteOrderHandler,
    CreateOrderListHandler,
  ],
  exports: [
    GetAllOrderHandler,
    GetByIdOrderHandler,
    UpsertOrderHandler,
    DeleteOrderHandler,
    CreateOrderListHandler,
  ],
})
export class OrderModule {}
