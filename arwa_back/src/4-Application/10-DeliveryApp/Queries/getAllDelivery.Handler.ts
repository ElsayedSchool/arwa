import { Injectable } from "@nestjs/common";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllDeliveryHandler {
  constructor(private readonly repo: DeliveryRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
