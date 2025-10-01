import { Injectable } from "@nestjs/common";
import { OrderItemRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllOrderItemHandler {
  constructor(private readonly repo: OrderItemRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
