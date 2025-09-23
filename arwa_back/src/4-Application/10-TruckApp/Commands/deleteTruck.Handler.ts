import { DeleteTruckCommand } from "./deleteTruck.Command";
import { TruckRepo } from "src/3-Infrastructure/Repositories";

export class DeleteTruckHandler {
  constructor(private repo: TruckRepo) {}
  async execute(cmd: DeleteTruckCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
