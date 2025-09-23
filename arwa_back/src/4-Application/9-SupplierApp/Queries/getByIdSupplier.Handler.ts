import { Injectable } from "@nestjs/common";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdSupplierQuery } from "./getByIdSupplier.Query";

@Injectable()
export class GetByIdSupplierHandler {
  constructor(private repo: SupplierRepo) {}
  async handle(q: GetByIdSupplierQuery) {
    return this.repo.findOneActive({ where: { id: q.id } });
  }
}
