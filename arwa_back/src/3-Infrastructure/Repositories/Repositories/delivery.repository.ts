import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Delivery } from "src/2-Domain/Entities";
import { BaseRepository } from "../Base/base.abstract.repository";
import { Logger } from "winston";

@Injectable()
export class DeliveryRepo extends BaseRepository<Delivery> {
  constructor(
    @InjectRepository(Delivery) repo: Repository<Delivery>,
    @Inject("Logger") private log: Logger
  ) {
    super(repo, log);
  }
}
