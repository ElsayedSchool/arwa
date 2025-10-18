import { RemoveCategoryCommand } from "./removeCategory.Command";
import { Injectable } from "@nestjs/common";
import { CategoryRepo } from "src/3-Infrastructure/Repositories";

@Injectable()
export class RemoveCategoryCommandHandler {
  constructor(private categoryRepo: CategoryRepo) {}
  async handle(command: RemoveCategoryCommand): Promise<boolean> {
    // First, check if the category exists and load it with subcategories
    const category = await this.categoryRepo.findByIdWithRelations(command.id, [
      "subcategories",
    ]);
    if (!category) {
      throw new Error("الفئة غير موجودة");
    }

    // Check if this is a main category with subcategories
    if (
      category.isBase &&
      category.subcategories &&
      category.subcategories.length > 0
    ) {
      const activeSubcategories = category.subcategories.filter(
        (sub) => !sub.isDeleted
      );
      if (activeSubcategories.length > 0) {
        throw new Error(
          "لا يمكن حذف الفئة الرئيسية قبل حذف جميع الفئات الفرعية المرتبطة بها"
        );
      }
    }

    return await this.categoryRepo.softRemoveByIdAsync(command.id, null);
  }
}
