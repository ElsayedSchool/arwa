import { Injectable } from "@nestjs/common";
import { InventoryRepo } from "src/3-Infrastructure/Repositories";
import { UpsertInventoryCommand } from "./upsertInventory.Command";

@Injectable()
export class UpsertInventoryHandler {
  constructor(private readonly repo: InventoryRepo) {}

  async handle(command: UpsertInventoryCommand) {
    const entity = this.repo.getRaw().create(command.payload);
    return this.repo.getRaw().save(entity);
  }
}
