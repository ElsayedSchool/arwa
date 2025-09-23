import { Injectable } from "@nestjs/common";
import { TruckRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllTruckHandler {
  constructor(private readonly repo: TruckRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
