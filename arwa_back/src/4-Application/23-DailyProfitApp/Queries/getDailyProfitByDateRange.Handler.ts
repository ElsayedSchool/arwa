import { Injectable } from "@nestjs/common";
import { DailyProfitRepo } from "src/3-Infrastructure/Repositories";
import { GetDailyProfitByDateRangeQuery } from "./getDailyProfitByDateRange.Query";
import { Between } from "typeorm";

@Injectable()
export class GetDailyProfitByDateRangeHandler {
  constructor(private readonly repo: DailyProfitRepo) {}
  async handle(query: GetDailyProfitByDateRangeQuery) {
    return this.repo.findActive({
      where: {
        profitDate: Between(query.startDate, query.endDate),
      },
      order: { profitDate: "DESC" },
    });
  }
}
