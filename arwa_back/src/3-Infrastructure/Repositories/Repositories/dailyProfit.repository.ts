import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DailyProfit } from "src/2-Domain/Entities";
import { BaseRepository } from "../Base/base.abstract.repository";
import { Logger } from "winston";

@Injectable()
export class DailyProfitRepo extends BaseRepository<DailyProfit> {
  constructor(
    @InjectRepository(DailyProfit) repo: Repository<DailyProfit>,
    @Inject("Logger") private log: Logger
  ) {
    super(repo, log);
  }
}
