import { Injectable } from "@nestjs/common";
import { Category } from "src/2-Domain";
import { CategoryRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllCategoriesQueryHandler {
  constructor(private categoryRepo: CategoryRepo) {}
  async handle() {
    return await this.categoryRepo.getAllAsync();
  }
}
