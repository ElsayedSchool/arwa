import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class PaymentRepo extends BaseRepository<Payment> {
  constructor(@InjectRepository(Payment) repo: Repository<Payment>) {
    super(repo);
  }
}
