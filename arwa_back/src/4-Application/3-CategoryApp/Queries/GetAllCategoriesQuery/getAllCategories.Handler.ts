import { Injectable } from "@nestjs/common";
import { Category } from "src/2-Domain";
import { CategoryRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class GetAllCategoriesQueryHandler {
  constructor(private categoryRepo: CategoryRepo) {}
  async handle() {
    const cats = await this.categoryRepo.getAllCategories();
    // shape result to match front-end: base categories with subcategories array
    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      character: c.character || null,
      color: c.color || null,
      // productCount for main category is the count of its subcategories
      productCount: (c.subcategories || []).length,
      // include subcategories shaped with productCount defaulting to 0
      subcategories: (c.subcategories || []).map((s) => ({
        id: s.id,
        name: s.name,
        character: s.character || null,
        color: s.color || null,
        productCount: 0,
      })),
    }));
  }
}
