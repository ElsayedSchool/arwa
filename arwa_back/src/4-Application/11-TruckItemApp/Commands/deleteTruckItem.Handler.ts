import { DeleteTruckItemCommand } from "./deleteTruckItem.Command";
import { TruckItemRepo } from "src/3-Infrastructure/Repositories";

export class DeleteTruckItemHandler {
  constructor(private repo: TruckItemRepo) {}
  async execute(cmd: DeleteTruckItemCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
