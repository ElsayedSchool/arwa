import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Sold } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class SoldRepo extends BaseRepository<Sold> {
  constructor(@InjectRepository(Sold) repo: Repository<Sold>) {
    super(repo);
  }
}
