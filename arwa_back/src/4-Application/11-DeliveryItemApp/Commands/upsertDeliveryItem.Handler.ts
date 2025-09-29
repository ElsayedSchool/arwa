import { UpsertDeliveryItemCommand } from "./upsertDeliveryItem.Command";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";

export class UpsertDeliveryItemHandler {
  constructor(private repo: DeliveryItemRepo) {}
  async execute(cmd: UpsertDeliveryItemCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
