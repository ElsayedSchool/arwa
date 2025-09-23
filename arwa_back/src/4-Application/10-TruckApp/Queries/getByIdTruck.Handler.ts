import { Injectable } from "@nestjs/common";
import { TruckRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdTruckQuery } from "./getByIdTruck.Query";

@Injectable()
export class GetByIdTruckHandler {
  constructor(private repo: TruckRepo) {}
  async handle(q: GetByIdTruckQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
