import { Injectable } from "@nestjs/common";
import { CategoryRepo } from "src/3-Infrastructure/Repositories";
import { Category } from "src/2-Domain";
import { UpsertCategoryCommand } from "./upsertCategory.Command";

@Injectable()
export class UpsertCategoryCommandHandler {
  constructor(private cateoryRepo: CategoryRepo) {}

  async handle(category: UpsertCategoryCommand): Promise<boolean> {
    // handle main category
    if (!category.type || category.type === "main") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let cat: Category | undefined;
      if (category?.id && category.id != 0) {
        cat = await this.cateoryRepo.findByIdAsync(category.id as number);
        if (!cat) return false;
      } else {
        cat = new Category();
      }
      cat.name = category.name;
      if (category.description) cat.description = category.description;
      if (!cat.subcategories) cat.subcategories = [];
      return await this.cateoryRepo.saveCategoryAsync(cat);
    }

    // handle subcategory
    if (category.type === "sub") {
      // For subcategories we persist them as separate Category entities
      // Ensure mainCategoryId provided
      if (!category.mainCategoryId) return false;

      // If updating an existing subcategory
      if (category.id && category.id !== 0) {
        const sub = await this.cateoryRepo.findByIdAsync(category.id as number);
        if (!sub) return false;
        sub.name = category.name;
        sub.character = category.character || sub.character;
        sub.color = category.color || sub.color;
        // ensure it's marked as subcategory
        sub.isBase = false;
        sub.mainCategoryId = category.mainCategoryId as number;
        return await this.cateoryRepo.saveCategoryAsync(sub);
      }

      // creating new subcategory
      const newSub = new Category();
      newSub.name = category.name;
      newSub.character = category.character || null;
      newSub.color = category.color || null;
      newSub.isBase = false;
      newSub.mainCategoryId = category.mainCategoryId as number;
      return await this.cateoryRepo.saveCategoryAsync(newSub);
    }

    return false;
  }
}
