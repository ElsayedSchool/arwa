import { Injectable } from "@nestjs/common";
import { TruckItemRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdTruckItemQuery } from "./getByIdTruckItem.Query";

@Injectable()
export class GetByIdTruckItemHandler {
  constructor(private repo: TruckItemRepo) {}
  async handle(q: GetByIdTruckItemQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
