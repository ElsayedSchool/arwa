import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Truck } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class TruckRepo extends BaseRepository<Truck> {
  constructor(@InjectRepository(Truck) repo: Repository<Truck>) {
    super(repo);
  }
}
