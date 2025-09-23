import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class OrderRepo extends BaseRepository<Order> {
  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo);
  }
}
