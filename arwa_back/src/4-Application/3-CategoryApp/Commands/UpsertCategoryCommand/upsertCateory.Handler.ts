import { Injectable } from '@nestjs/common';
import { CategoryRepo } from 'src/3-Infrastructure/Repositories';
import { Category } from 'src/2-Domain';
import { UpsertCategoryCommand } from './upsertCategory.Command';

@Injectable()
export class UpsertCategoryCommandHandler {
  constructor(private cateoryRepo: CategoryRepo) {}

  async handle(category: UpsertCategoryCommand): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let cat: Category | undefined;
    if (category?.id != 0) {
      cat = await this.cateoryRepo.findByIdAsync(category.id as number);
    } else {
      cat = new Category();
    }
    cat.name = category.name;
    return await this.cateoryRepo.saveCategoryAsync(cat);
  }
}
