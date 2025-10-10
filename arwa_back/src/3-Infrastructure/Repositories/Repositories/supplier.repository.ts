import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Supplier } from "src/2-Domain/Entities";
import { BaseRepository } from "../Base/base.abstract.repository";
import { Logger } from "winston";

@Injectable()
export class SupplierRepo extends BaseRepository<Supplier> {
  constructor(
    @InjectRepository(Supplier) repo: Repository<Supplier>,
    @Inject("Logger") private log: Logger
  ) {
    super(repo, log);
  }
}
