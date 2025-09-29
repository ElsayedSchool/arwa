import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllDeliveryItemHandler } from "./Queries/getAllDeliveryItem.Handler";
import { GetByIdDeliveryItemHandler } from "./Queries/getByIdDeliveryItem.Handler";
import { UpsertDeliveryItemHandler } from "./Commands/upsertDeliveryItem.Handler";
import { DeleteDeliveryItemHandler } from "./Commands/deleteDeliveryItem.Handler";
import { UpsertDeliveryItemCommand } from "./Commands/upsertDeliveryItem.Command";
import { DeleteDeliveryItemCommand } from "./Commands/deleteDeliveryItem.Command";

@Controller("delivery-item")
export class DeliveryItemController {
  constructor(
    private readonly getAll: GetAllDeliveryItemHandler,
    private readonly getById: GetByIdDeliveryItemHandler,
    private readonly upsert: UpsertDeliveryItemHandler,
    private readonly del: DeleteDeliveryItemHandler
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
    return this.upsert.execute(new UpsertDeliveryItemCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteDeliveryItemCommand(id));
  }
}
