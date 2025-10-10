import { DeleteSupplierCommand } from "./deleteSupplier.Command";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";
import { Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class DeleteSupplierHandler {
  constructor(private repo: SupplierRepo) {}
  async execute(cmd: DeleteSupplierCommand) {
    // First check if the supplier exists and get its details
    const supplier = await this.repo.findByIdAsync(cmd.id);

    // Prevent deletion of stock suppliers
    if (supplier.isStock) {
      throw new BadRequestException("لا يمكن حذف مورد المخزون التلقائي");
    }

    // Prevent deletion of owner suppliers
    if (supplier.isOwner) {
      throw new BadRequestException("لا يمكن حذف مورد المالك");
    }

    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
