import { Injectable } from "@nestjs/common";
import { DeliveryRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdDeliveryQuery } from "./getByIdDelivery.Query";

@Injectable()
export class GetByIdDeliveryHandler {
  constructor(private repo: DeliveryRepo) {}
  async handle(q: GetByIdDeliveryQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
