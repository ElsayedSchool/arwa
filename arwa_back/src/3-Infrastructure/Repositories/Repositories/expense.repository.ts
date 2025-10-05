import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Expense } from "src/2-Domain/Entities";
import { BaseRepository } from "../Base/base.abstract.repository";
import { Logger } from "winston";

@Injectable()
export class ExpenseRepo extends BaseRepository<Expense> {
  constructor(
    @InjectRepository(Expense) repo: Repository<Expense>,
    @Inject("Logger") private log: Logger
  ) {
    super(repo, log);
  }
}
