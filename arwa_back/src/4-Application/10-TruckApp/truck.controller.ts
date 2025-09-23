import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllTruckHandler } from "./Queries/getAllTruck.Handler";
import { GetByIdTruckHandler } from "./Queries/getByIdTruck.Handler";
import { UpsertTruckHandler } from "./Commands/upsertTruck.Handler";
import { DeleteTruckHandler } from "./Commands/deleteTruck.Handler";
import { UpsertTruckCommand } from "./Commands/upsertTruck.Command";
import { DeleteTruckCommand } from "./Commands/deleteTruck.Command";

@Controller("truck")
export class TruckController {
  constructor(
    private readonly getAll: GetAllTruckHandler,
    private readonly getById: GetByIdTruckHandler,
    private readonly upsert: UpsertTruckHandler,
    private readonly del: DeleteTruckHandler
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
    return this.upsert.execute(new UpsertTruckCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteTruckCommand(id));
  }
}
