import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { GetAllCategoriesQueryHandler } from './Queries/GetAllCategoriesQuery/getAllCategories.Handler';
import { UpsertCategoryCommandHandler } from './Commands/UpsertCategoryCommand/upsertCateory.Handler';
import { RemoveCategoryCommandHandler } from './Commands/RemoveCategoryCommand/removeCategory.Handler';
import { InfrastructureModule } from 'src/3-Infrastructure/Infrastructure.Module';

@Module({
  imports: [InfrastructureModule],
  controllers: [CategoryController],
  providers: [
    GetAllCategoriesQueryHandler,
    UpsertCategoryCommandHandler,
    RemoveCategoryCommandHandler,
  ],
})
export class CategoryModule {}
