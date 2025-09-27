import { DeleteSupplierCommand } from "./deleteSupplier.Command";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeleteSupplierHandler {
  constructor(private repo: SupplierRepo) {}
  async execute(cmd: DeleteSupplierCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
