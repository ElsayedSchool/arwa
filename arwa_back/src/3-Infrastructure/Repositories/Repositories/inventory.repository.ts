import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inventory } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class InventoryRepo extends BaseRepository<Inventory> {
  constructor(@InjectRepository(Inventory) repo: Repository<Inventory>) {
    super(repo);
  }
}
