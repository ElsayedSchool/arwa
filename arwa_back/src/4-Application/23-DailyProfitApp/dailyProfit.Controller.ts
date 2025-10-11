import { Controller, Get, Post, Query, Param } from "@nestjs/common";
import { CalculateDailyProfitHandler } from "./Commands/calculateDailyProfit.Handler";
import { GetAllDailyProfitHandler } from "./Queries/getAllDailyProfit.Handler";
import { GetDailyProfitByDateHandler } from "./Queries/getDailyProfitByDate.Handler";
import { GetDailyProfitByDateRangeHandler } from "./Queries/getDailyProfitByDateRange.Handler";
import { CalculateDailyProfitCommand } from "./Commands/calculateDailyProfit.Command";
import { GetAllDailyProfitQuery } from "./Queries/getAllDailyProfit.Query";
import { GetDailyProfitByDateQuery } from "./Queries/getDailyProfitByDate.Query";
import { GetDailyProfitByDateRangeQuery } from "./Queries/getDailyProfitByDateRange.Query";

@Controller("daily-profit")
export class DailyProfitController {
  constructor(
    private readonly calculateHandler: CalculateDailyProfitHandler,
    private readonly getAllHandler: GetAllDailyProfitHandler,
    private readonly getByDateHandler: GetDailyProfitByDateHandler,
    private readonly getByDateRangeHandler: GetDailyProfitByDateRangeHandler
  ) {}

  @Post("calculate/:date")
  async calculateDailyProfit(@Param("date") dateString: string) {
    const date = new Date(dateString);
    const command = new CalculateDailyProfitCommand(date);
    return await this.calculateHandler.execute(command);
  }

  @Get(":date")
  async getDailyProfitByDate(@Param("date") dateString: string) {
    const date = new Date(dateString);
    const query = new GetDailyProfitByDateQuery(date);
    return await this.getByDateHandler.handle(query);
  }

  @Get()
  async getDailyProfits(
    @Query("startDate") startDateString?: string,
    @Query("endDate") endDateString?: string
  ) {
    if (startDateString && endDateString) {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      const query = new GetDailyProfitByDateRangeQuery(startDate, endDate);
      return await this.getByDateRangeHandler.handle(query);
    } else {
      const query = new GetAllDailyProfitQuery();
      return await this.getAllHandler.handle(query);
    }
  }

  @Get("today/calculate")
  async calculateTodayProfit() {
    const today = new Date();
    const command = new CalculateDailyProfitCommand(today);
    return await this.calculateHandler.execute(command);
  }
}
