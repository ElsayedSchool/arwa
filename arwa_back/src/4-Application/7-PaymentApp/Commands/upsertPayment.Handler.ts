import { UpsertPaymentCommand } from "./upsertPayment.Command";
import { PaymentRepo } from "src/3-Infrastructure/Repositories";

export class UpsertPaymentHandler {
  constructor(private repo: PaymentRepo) {}
  async execute(cmd: UpsertPaymentCommand) {
    return this.repo.getRaw().save(cmd.payload);
  }
}
