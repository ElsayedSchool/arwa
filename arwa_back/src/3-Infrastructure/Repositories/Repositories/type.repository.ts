import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Type } from "src/2-Domain/Entities";
import { BaseRepository } from "../base.repository";

@Injectable()
export class TypeRepo extends BaseRepository<Type> {
  constructor(@InjectRepository(Type) repo: Repository<Type>) {
    super(repo);
  }
}
