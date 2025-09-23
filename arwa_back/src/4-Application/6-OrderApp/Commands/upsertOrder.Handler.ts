import { UpsertOrderCommand } from "./upsertOrder.Command";
import { OrderRepo } from "src/3-Infrastructure/Repositories";

export class UpsertOrderHandler {
  constructor(private repo: OrderRepo) {}
  async execute(cmd: UpsertOrderCommand) {
    const saved = await this.repo.getRaw().save(cmd.payload);
    return saved;
  }
}
