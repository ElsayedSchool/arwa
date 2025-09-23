import { Injectable } from "@nestjs/common";
import { PaymentRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllPaymentHandler {
  constructor(private readonly repo: PaymentRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
