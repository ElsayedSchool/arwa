import { DeleteSoldCommand } from "./deleteSold.Command";
import { SoldRepo } from "src/3-Infrastructure/Repositories";

export class DeleteSoldHandler {
  constructor(private repo: SoldRepo) {}
  async execute(cmd: DeleteSoldCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
