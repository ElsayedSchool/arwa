import { Injectable } from "@nestjs/common";
import { DailyProfitService } from "../dailyProfit.Service";
import { CalculateDailyProfitCommand } from "./calculateDailyProfit.Command";

@Injectable()
export class CalculateDailyProfitHandler {
  constructor(private readonly dailyProfitService: DailyProfitService) {}
  async execute(command: CalculateDailyProfitCommand) {
    return await this.dailyProfitService.calculateDailyProfit(command.date);
  }
}
