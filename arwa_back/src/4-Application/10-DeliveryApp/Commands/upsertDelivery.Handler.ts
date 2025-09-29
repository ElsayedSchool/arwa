import { UpsertDeliveryCommand } from "./upsertDelivery.Command";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";

export class UpsertDeliveryHandler {
  constructor(private repo: DeliveryRepo) {}
  async execute(cmd: UpsertDeliveryCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
