import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllOrderItemHandler } from "./Queries/getAllOrderItem.Handler";
import { GetByIdOrderItemHandler } from "./Queries/getByIdOrderItem.Handler";
import { UpsertOrderItemHandler } from "./Commands/upsertOrderItem.Handler";
import { DeleteOrderItemHandler } from "./Commands/deleteOrderItem.Handler";
import { UpsertOrderItemCommand } from "./Commands/upsertOrderItem.Command";
import { DeleteOrderItemCommand } from "./Commands/deleteOrderItem.Command";

@Controller("orderItem")
export class OrderItemController {
  constructor(
    private readonly getAll: GetAllOrderItemHandler,
    private readonly getById: GetByIdOrderItemHandler,
    private readonly upsert: UpsertOrderItemHandler,
    private readonly del: DeleteOrderItemHandler
  ) {}

  @Get()
  async all() {
    return this.getAll.handle();
  }

  @Get(":id")
  async one(@Param("id") id: string) {
    return this.getById.handle({ id });
  }

  @Post()
  async upsertOne(@Body() body: any) {
    return this.upsert.execute(new UpsertOrderItemCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteOrderItemCommand(id));
  }
}
