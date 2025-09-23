import { Injectable } from "@nestjs/common";
import { TypeRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdTypeQuery } from "./getByIdType.Query";

@Injectable()
export class GetByIdTypeHandler {
  constructor(private repo: TypeRepo) {}
  async handle(q: GetByIdTypeQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
