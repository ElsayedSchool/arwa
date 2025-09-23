import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Supplier } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class SupplierRepo extends BaseRepository<Supplier> {
  constructor(@InjectRepository(Supplier) repo: Repository<Supplier>) {
    super(repo);
  }
}
