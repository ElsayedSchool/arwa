import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllOrderHandler } from "./Queries/getAllOrder.Handler";
import { GetByIdOrderHandler } from "./Queries/getByIdOrder.Handler";
import { UpsertOrderHandler } from "./Commands/upsertOrder.Handler";
import { DeleteOrderHandler } from "./Commands/deleteOrder.Handler";
import { UpsertOrderCommand } from "./Commands/upsertOrder.Command";
import { DeleteOrderCommand } from "./Commands/deleteOrder.Command";

@Controller("order")
export class OrderController {
  constructor(
    private readonly getAll: GetAllOrderHandler,
    private readonly getById: GetByIdOrderHandler,
    private readonly upsert: UpsertOrderHandler,
    private readonly del: DeleteOrderHandler
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
    return this.upsert.execute(new UpsertOrderCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteOrderCommand(id));
  }
}
