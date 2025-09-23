import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllTypeHandler } from "./Queries/getAllType.Handler";
import { GetByIdTypeHandler } from "./Queries/getByIdType.Handler";
import { UpsertTypeHandler } from "./Commands/upsertType.Handler";
import { DeleteTypeHandler } from "./Commands/deleteType.Handler";
import { UpsertTypeCommand } from "./Commands/upsertType.Command";
import { DeleteTypeCommand } from "./Commands/deleteType.Command";

@Controller("type")
export class TypeController {
  constructor(
    private readonly getAll: GetAllTypeHandler,
    private readonly getById: GetByIdTypeHandler,
    private readonly upsert: UpsertTypeHandler,
    private readonly del: DeleteTypeHandler
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
    return this.upsert.execute(new UpsertTypeCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteTypeCommand(id));
  }
}
