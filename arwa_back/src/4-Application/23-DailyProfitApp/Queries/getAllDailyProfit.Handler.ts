import { Injectable } from "@nestjs/common";
import { DailyProfitRepo } from "src/3-Infrastructure/Repositories";
import { GetAllDailyProfitQuery } from "./getAllDailyProfit.Query";

@Injectable()
export class GetAllDailyProfitHandler {
  constructor(private readonly repo: DailyProfitRepo) {}
  async handle(query: GetAllDailyProfitQuery) {
    return this.repo.findActive({
      order: { profitDate: "DESC" },
    });
  }
}
