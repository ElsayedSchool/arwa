import { UpsertTypeCommand } from "./upsertType.Command";
import { TypeRepo } from "src/3-Infrastructure/Repositories";

export class UpsertTypeHandler {
  constructor(private repo: TypeRepo) {}
  async execute(cmd: UpsertTypeCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
