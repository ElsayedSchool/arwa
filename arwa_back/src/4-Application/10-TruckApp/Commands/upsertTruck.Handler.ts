import { UpsertTruckCommand } from "./upsertTruck.Command";
import { TruckRepo } from "src/3-Infrastructure/Repositories";

export class UpsertTruckHandler {
  constructor(private repo: TruckRepo) {}
  async execute(cmd: UpsertTruckCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
