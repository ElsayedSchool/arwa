import { Injectable } from "@nestjs/common";
import { DeliveryItemRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdDeliveryItemQuery } from "./getByIdDeliveryItem.Query";

@Injectable()
export class GetByIdDeliveryItemHandler {
  constructor(private repo: DeliveryItemRepo) {}
  async handle(q: GetByIdDeliveryItemQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
