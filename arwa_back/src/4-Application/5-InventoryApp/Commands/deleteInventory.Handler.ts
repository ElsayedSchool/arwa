import { Injectable } from "@nestjs/common";
import { InventoryRepo } from "src/3-Infrastructure/Repositories";
import { DeleteInventoryCommand } from "./deleteInventory.Command";

@Injectable()
export class DeleteInventoryHandler {
  constructor(private readonly repo: InventoryRepo) {}

  async handle(cmd: DeleteInventoryCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
