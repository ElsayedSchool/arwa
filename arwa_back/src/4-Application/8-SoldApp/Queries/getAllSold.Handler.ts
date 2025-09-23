import { Injectable } from "@nestjs/common";
import { SoldRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllSoldHandler {
  constructor(private readonly repo: SoldRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
