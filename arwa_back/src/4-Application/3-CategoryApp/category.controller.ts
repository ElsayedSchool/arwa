import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { GetAllCategoriesQueryHandler } from './Queries/GetAllCategoriesQuery/getAllCategories.Handler';
import { RemoveCategoryCommandHandler } from './Commands/RemoveCategoryCommand/removeCategory.Handler';
import { Category } from 'src/2-Domain';
import { RemoveCategoryCommand } from './Commands/RemoveCategoryCommand/removeCategory.Command';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/1-Core/Decorators/GetUser.Decorator';
import { RoleGuard } from 'src/1-Core/Guards/Roles.Guard';
import { Roles } from 'src/3-Infrastructure/Authentication/Roles/Roles.Type';
import { JWTToken } from 'src/3-Infrastructure/Authentication/AuthModels/token.model';
import { UpsertCategoryCommandHandler } from './Commands/UpsertCategoryCommand/upsertCateory.Handler';
import { UpsertCategoryCommand } from './Commands/UpsertCategoryCommand/upsertCategory.Command';

@Controller('category')
export class CategoryController {
  constructor(
    private getAll: GetAllCategoriesQueryHandler,
    private upsert: UpsertCategoryCommandHandler,
    private remove: RemoveCategoryCommandHandler,
  ) {}

  @Get()
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles('Admin', 'User', 'Visitor')
  async getAllCategories(): Promise<Category[]> {
    return await this.getAll.handle();
  }

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles('Admin')
  async upsertCategory(
    @Body() command: UpsertCategoryCommand,
    @GetUser() user: JWTToken,
  ): Promise<boolean> {
    return await this.upsert.handle(command);
  }

  @Put('/remove')
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles('Admin')
  async removeCategory(
    @Body() command: RemoveCategoryCommand,
  ): Promise<boolean> {
    return await this.remove.handle(command);
  }
}
