import { Injectable } from "@nestjs/common";
import { ProfileRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllUsersQueryHander {
  constructor(private profileRepo: ProfileRepo) {}

  async handle() {
    return []; //await this.profileRepo.getAllUsersData();
  }
}
