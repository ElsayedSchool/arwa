import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllSoldHandler } from "./Queries/getAllSold.Handler";
import { GetByIdSoldHandler } from "./Queries/getByIdSold.Handler";
import { UpsertSoldHandler } from "./Commands/upsertSold.Handler";
import { DeleteSoldHandler } from "./Commands/deleteSold.Handler";
import { UpsertSoldCommand } from "./Commands/upsertSold.Command";
import { DeleteSoldCommand } from "./Commands/deleteSold.Command";

@Controller("sold")
export class SoldController {
  constructor(
    private readonly getAll: GetAllSoldHandler,
    private readonly getById: GetByIdSoldHandler,
    private readonly upsert: UpsertSoldHandler,
    private readonly del: DeleteSoldHandler
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
    return this.upsert.execute(new UpsertSoldCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteSoldCommand(id));
  }
}
