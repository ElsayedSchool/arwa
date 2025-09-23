import { Injectable } from "@nestjs/common";
import { SupplierRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllSupplierHandler {
  constructor(private readonly repo: SupplierRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
