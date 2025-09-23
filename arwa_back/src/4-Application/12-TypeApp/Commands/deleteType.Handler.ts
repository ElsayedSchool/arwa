import { DeleteTypeCommand } from "./deleteType.Command";
import { TypeRepo } from "src/3-Infrastructure/Repositories";

export class DeleteTypeHandler {
  constructor(private repo: TypeRepo) {}
  async execute(cmd: DeleteTypeCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
