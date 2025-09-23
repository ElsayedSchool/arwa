import { Injectable } from "@nestjs/common";
import { OrderRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdOrderQuery } from "./getByIdOrder.Query";
@Injectable()
export class GetByIdOrderHandler {
  constructor(private repo: OrderRepo) {}
  async handle(q: GetByIdOrderQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
