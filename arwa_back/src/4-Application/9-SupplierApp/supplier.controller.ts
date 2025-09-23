import { Controller, Get, Param, Post, Body, Delete } from "@nestjs/common";
import { GetAllSupplierHandler } from "./Queries/getAllSupplier.Handler";
import { GetByIdSupplierHandler } from "./Queries/getByIdSupplier.Handler";
import { UpsertSupplierHandler } from "./Commands/upsertSupplier.Handler";
import { DeleteSupplierHandler } from "./Commands/deleteSupplier.Handler";
import { UpsertSupplierCommand } from "./Commands/upsertSupplier.Command";
import { DeleteSupplierCommand } from "./Commands/deleteSupplier.Command";

@Controller("supplier")
export class SupplierController {
  constructor(
    private readonly getAll: GetAllSupplierHandler,
    private readonly getById: GetByIdSupplierHandler,
    private readonly upsert: UpsertSupplierHandler,
    private readonly del: DeleteSupplierHandler
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
    return this.upsert.execute(new UpsertSupplierCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.execute(new DeleteSupplierCommand(id));
  }
}
