import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Delivery } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class DeliveryRepo extends BaseRepository<Delivery> {
  constructor(@InjectRepository(Delivery) repo: Repository<Delivery>) {
    super(repo);
  }
}
