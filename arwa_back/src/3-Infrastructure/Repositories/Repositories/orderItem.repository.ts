import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderItem } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class OrderItemRepo extends BaseRepository<OrderItem> {
  constructor(@InjectRepository(OrderItem) repo: Repository<OrderItem>) {
    super(repo);
  }
}
