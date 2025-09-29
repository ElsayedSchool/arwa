import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllDeliveryHandler } from "./Queries/getAllDelivery.Handler";
import { GetByIdDeliveryHandler } from "./Queries/getByIdDelivery.Handler";
import { UpsertDeliveryHandler } from "./Commands/upsertDelivery.Handler";
import { DeleteDeliveryHandler } from "./Commands/deleteDelivery.Handler";
import { UpsertDeliveryCommand } from "./Commands/upsertDelivery.Command";
import { DeleteDeliveryCommand } from "./Commands/deleteDelivery.Command";

@Controller("delivery")
export class DeliveryController {
  constructor(
    private readonly getAll: GetAllDeliveryHandler,
    private readonly getById: GetByIdDeliveryHandler,
    private readonly upsert: UpsertDeliveryHandler,
    private readonly del: DeleteDeliveryHandler
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
    return this.upsert.execute(new UpsertDeliveryCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteDeliveryCommand(id));
  }
}
