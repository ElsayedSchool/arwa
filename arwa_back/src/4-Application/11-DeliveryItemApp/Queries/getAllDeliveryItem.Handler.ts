import { Injectable } from "@nestjs/common";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllDeliveryItemHandler {
  constructor(private readonly repo: DeliveryItemRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
