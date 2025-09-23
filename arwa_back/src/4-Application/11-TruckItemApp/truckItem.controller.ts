import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllTruckItemHandler } from "./Queries/getAllTruckItem.Handler";
import { GetByIdTruckItemHandler } from "./Queries/getByIdTruckItem.Handler";
import { UpsertTruckItemHandler } from "./Commands/upsertTruckItem.Handler";
import { DeleteTruckItemHandler } from "./Commands/deleteTruckItem.Handler";
import { UpsertTruckItemCommand } from "./Commands/upsertTruckItem.Command";
import { DeleteTruckItemCommand } from "./Commands/deleteTruckItem.Command";

@Controller("truck-item")
export class TruckItemController {
  constructor(
    private readonly getAll: GetAllTruckItemHandler,
    private readonly getById: GetByIdTruckItemHandler,
    private readonly upsert: UpsertTruckItemHandler,
    private readonly del: DeleteTruckItemHandler
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
    return this.upsert.execute(new UpsertTruckItemCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteTruckItemCommand(id));
  }
}
