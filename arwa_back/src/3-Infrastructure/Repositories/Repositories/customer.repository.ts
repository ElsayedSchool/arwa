import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class CustomerRepo extends BaseRepository<Customer> {
  constructor(@InjectRepository(Customer) repo: Repository<Customer>) {
    super(repo);
  }
}
