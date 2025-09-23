import { UpsertTruckItemCommand } from "./upsertTruckItem.Command";
import { TruckItemRepo } from "src/3-Infrastructure/Repositories";

export class UpsertTruckItemHandler {
  constructor(private repo: TruckItemRepo) {}
  async execute(cmd: UpsertTruckItemCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
