import { Injectable } from "@nestjs/common";
import { InventoryRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllInventoryHandler {
  constructor(private readonly repo: InventoryRepo) {}

  async handle() {
    return this.repo.findActive();
  }
}
