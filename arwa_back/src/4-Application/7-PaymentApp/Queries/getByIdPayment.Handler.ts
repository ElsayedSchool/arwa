import { Injectable } from "@nestjs/common";
import { PaymentRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdPaymentQuery } from "./getByIdPayment.Query";

@Injectable()
export class GetByIdPaymentHandler {
  constructor(private repo: PaymentRepo) {}
  async handle(q: GetByIdPaymentQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
