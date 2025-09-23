import { DeletePaymentCommand } from "./deletePayment.Command";
import { PaymentRepo } from "src/3-Infrastructure/Repositories";

export class DeletePaymentHandler {
  constructor(private repo: PaymentRepo) {}
  async execute(cmd: DeletePaymentCommand) {
    return this.repo.softDelete(cmd.id, cmd.deletedById, cmd.deletedByName);
  }
}
