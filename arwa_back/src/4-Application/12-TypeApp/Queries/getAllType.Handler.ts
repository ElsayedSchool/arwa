import { Injectable } from "@nestjs/common";
import { TypeRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllTypeHandler {
  constructor(private readonly repo: TypeRepo) {}
  async handle() {
    return this.repo.findActive();
  }
}
