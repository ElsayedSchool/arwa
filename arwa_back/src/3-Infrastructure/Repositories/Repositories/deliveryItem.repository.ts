import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryItem } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class DeliveryItemRepo extends BaseRepository<DeliveryItem> {
  constructor(@InjectRepository(DeliveryItem) repo: Repository<DeliveryItem>) {
    super(repo);
  }
}
