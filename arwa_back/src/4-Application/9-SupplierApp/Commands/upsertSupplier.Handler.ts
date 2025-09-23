import { UpsertSupplierCommand } from "./upsertSupplier.Command";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";

export class UpsertSupplierHandler {
  constructor(private repo: SupplierRepo) {}
  async execute(cmd: UpsertSupplierCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
