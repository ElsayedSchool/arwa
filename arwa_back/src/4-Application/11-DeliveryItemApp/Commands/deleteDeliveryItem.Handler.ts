import { DeleteDeliveryItemCommand } from "./deleteDeliveryItem.Command";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";

export class DeleteDeliveryItemHandler {
  constructor(private repo: DeliveryItemRepo) {}
  async execute(cmd: DeleteDeliveryItemCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
