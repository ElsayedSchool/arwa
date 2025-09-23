import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TruckItem } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class TruckItemRepo extends BaseRepository<TruckItem> {
  constructor(@InjectRepository(TruckItem) repo: Repository<TruckItem>) {
    super(repo);
  }
}
