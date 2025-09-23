import { UpsertSoldCommand } from "./upsertSold.Command";
import { SoldRepo } from "src/3-Infrastructure/Repositories";

export class UpsertSoldHandler {
  constructor(private repo: SoldRepo) {}
  async execute(cmd: UpsertSoldCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
