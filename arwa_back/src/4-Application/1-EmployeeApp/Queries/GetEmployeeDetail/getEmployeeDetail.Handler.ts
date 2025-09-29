import { UserRepo } from "src/3-Infrastructure/Repositories";
import { GetEmployeeDetailQuery } from "./getEmployeeDetail.Query";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetEmployeeDetailHandler {
  constructor(private userRepo: UserRepo) {}
  async handle(query: GetEmployeeDetailQuery): Promise<any> {
    console.log("check it ");
    return await this.userRepo.getCouinsOfUser(query.id);
  }
}
