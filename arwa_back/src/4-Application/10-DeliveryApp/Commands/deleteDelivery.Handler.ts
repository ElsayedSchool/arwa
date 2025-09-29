import { DeleteDeliveryCommand } from "./deleteDelivery.Command";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";

export class DeleteDeliveryHandler {
  constructor(private repo: DeliveryRepo) {}
  async execute(cmd: DeleteDeliveryCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
