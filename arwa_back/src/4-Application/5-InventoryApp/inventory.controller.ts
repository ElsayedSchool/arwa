import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
} from "@nestjs/common";
import { GetAllInventoryHandler } from "./Queries/getAllInventory.Handler";
import { GetByIdInventoryHandler } from "./Queries/getByIdInventory.Handler";
import { UpsertInventoryHandler } from "./Commands/upsertInventory.Handler";
import { DeleteInventoryHandler } from "./Commands/deleteInventory.Handler";
import { UpsertInventoryCommand } from "./Commands/upsertInventory.Command";
import { DeleteInventoryCommand } from "./Commands/deleteInventory.Command";

@Controller("inventory")
export class InventoryController {
  constructor(
    private readonly getAll: GetAllInventoryHandler,
    private readonly getById: GetByIdInventoryHandler,
    private readonly upsert: UpsertInventoryHandler,
    private readonly del: DeleteInventoryHandler
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
    return this.upsert.handle(new UpsertInventoryCommand(body));
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.del.handle(new DeleteInventoryCommand(id));
  }
}
