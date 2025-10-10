import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import { CronJob } from "cron";
import { UpdateStockService } from "./updateStock/updateStock.Service";

@Injectable()
export class ScheduleService
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  matchesSchedule: CronJob = null;
  hourlySchedule: CronJob = null;
  dailySchedule: CronJob = null;
  weeklySchedule: CronJob = null;

  constructor(private updateStockService: UpdateStockService) {}
  onApplicationBootstrap(): void {
    /* this.matchesSchedule = new CronJob(
      '0,15,30,45 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * *',
      async () => {
        await this.startMatchesSchedule();
      },
      null,
      true,
    ); */
    this.hourlySchedule = new CronJob(
      "0 6-23/1 * * *",
      async () => {},
      null,
      true
    );
    // Perform startup operations here
    this.dailySchedule = new CronJob(
      "0 20 * * *", // Run at 8:00 PM every day
      async () => {
        await this.startDailySchedule();
      },
      null,
      true
    );
    // weekly schedule
    /* this.weeklySchedule = new CronJob(
      '0 1,3,5,7 * * 5',
      async () => {
        await this.startWeeklySchedule();
      },
      null,
      true,
    ); */
  }

  async startMatchesSchedule() {}

  // hourly schedule include evaluate matches, challenges update and complete
  async startHourlySchedule() {
    /* await this.updateMatches.handle();
    await this.completeMatch.handle();
    await this.completeChallenge.handle(); */
  }

  async startDailySchedule() {
    await this.updateStockService.updateStockAtEndOfDay();
  }

  onApplicationShutdown(): void {
    this.matchesSchedule?.stop();
    this.hourlySchedule?.stop();
    this.dailySchedule?.stop();
    this.weeklySchedule?.stop();
  }
}
