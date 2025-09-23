import { Injectable } from "@nestjs/common";
import { InventoryRepo } from "src/3-Infrastructure/Repositories";
import { GetByIdInventoryQuery } from "./getByIdInventory.Query";

@Injectable()
export class GetByIdInventoryHandler {
  constructor(private readonly repo: InventoryRepo) {}

  async handle(query: GetByIdInventoryQuery) {
    return this.repo.findOneActive({ where: { id: query.id } });
  }
}
