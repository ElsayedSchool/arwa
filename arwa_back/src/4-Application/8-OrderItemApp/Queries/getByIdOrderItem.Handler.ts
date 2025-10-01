import { Injectable } from "@nestjs/common";
import { OrderItemRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdOrderItemQuery } from "./getByIdOrderItem.Query";

@Injectable()
export class GetByIdOrderItemHandler {
  constructor(private repo: OrderItemRepo) {}
  async handle(q: GetByIdOrderItemQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
