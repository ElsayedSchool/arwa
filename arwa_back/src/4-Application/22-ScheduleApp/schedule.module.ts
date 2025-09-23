import { Module } from "@nestjs/common";
import { InfrastructureModule } from "src/3-Infrastructure/Infrastructure.Module";
import { ScheduleService } from "./schedule.service";
import { TimeService } from "src/3-Infrastructure/timeService/time.service";

@Module({
  imports: [InfrastructureModule],
  providers: [ScheduleService, TimeService],
  exports: [ScheduleService, TimeService],
})
export class ScheduleModule {}
