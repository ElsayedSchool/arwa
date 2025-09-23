import { Injectable } from "@nestjs/common";
import { OrderRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllOrderHandler {
  constructor(private readonly repo: OrderRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
