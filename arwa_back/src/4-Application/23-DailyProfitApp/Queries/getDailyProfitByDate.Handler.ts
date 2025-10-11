import { Injectable } from "@nestjs/common";
import { DailyProfitRepo } from "src/3-Infrastructure/Repositories";
import { GetDailyProfitByDateQuery } from "./getDailyProfitByDate.Query";

@Injectable()
export class GetDailyProfitByDateHandler {
  constructor(private readonly repo: DailyProfitRepo) {}
  async handle(query: GetDailyProfitByDateQuery) {
    const profits = await this.repo.findActive({
      where: { profitDate: query.date },
    });
    return profits.length > 0 ? profits[0] : null;
  }
}
