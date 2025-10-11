import { Module } from "@nestjs/common";
import { DailyProfitService } from "./dailyProfit.Service";
import { DailyProfitController } from "./dailyProfit.Controller";
import { CalculateDailyProfitHandler } from "./Commands/calculateDailyProfit.Handler";
import { GetAllDailyProfitHandler } from "./Queries/getAllDailyProfit.Handler";
import { GetDailyProfitByDateHandler } from "./Queries/getDailyProfitByDate.Handler";
import { GetDailyProfitByDateRangeHandler } from "./Queries/getDailyProfitByDateRange.Handler";
import { RepositoryModule } from "src/3-Infrastructure/Repositories/repository.module";

@Module({
  imports: [RepositoryModule],
  providers: [
    DailyProfitService,
    CalculateDailyProfitHandler,
    GetAllDailyProfitHandler,
    GetDailyProfitByDateHandler,
    GetDailyProfitByDateRangeHandler,
  ],
  controllers: [DailyProfitController],
  exports: [DailyProfitService],
})
export class DailyProfitModule {}
