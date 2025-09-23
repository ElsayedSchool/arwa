import { Injectable } from "@nestjs/common";
import { SoldRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdSoldQuery } from "./getByIdSold.Query";

@Injectable()
export class GetByIdSoldHandler {
  constructor(private repo: SoldRepo) {}
  async handle(q: GetByIdSoldQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
