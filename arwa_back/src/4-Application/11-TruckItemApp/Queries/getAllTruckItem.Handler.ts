import { Injectable } from "@nestjs/common";
import { TruckItemRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllTruckItemHandler {
  constructor(private readonly repo: TruckItemRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
