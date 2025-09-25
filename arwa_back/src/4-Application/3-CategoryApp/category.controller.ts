import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Delete,
  Param,
} from "@nestjs/common";
import { GetAllCategoriesQueryHandler } from "./Queries/GetAllCategoriesQuery/getAllCategories.Handler";
import { RemoveCategoryCommandHandler } from "./Commands/RemoveCategoryCommand/removeCategory.Handler";
import { Category } from "src/2-Domain";
import { RemoveCategoryCommand } from "./Commands/RemoveCategoryCommand/removeCategory.Command";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/1-Core/Decorators/GetUser.Decorator";
import { RoleGuard } from "src/1-Core/Guards/Roles.Guard";
import { Roles } from "src/3-Infrastructure/Authentication/Roles/Roles.Type";
import { JWTToken } from "src/3-Infrastructure/Authentication/AuthModels/token.model";
import { UpsertCategoryCommandHandler } from "./Commands/UpsertCategoryCommand/upsertCateory.Handler";
import { UpsertCategoryCommand } from "./Commands/UpsertCategoryCommand/upsertCategory.Command";

@Controller("category")
export class CategoryController {
  constructor(
    private getAll: GetAllCategoriesQueryHandler,
    private upsert: UpsertCategoryCommandHandler,
    private remove: RemoveCategoryCommandHandler
  ) {}

  @Get()
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin", "User", "Visitor")
  async getAllCategories(): Promise<any[]> {
    return await this.getAll.handle();
  }

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async upsertCategory(
    @Body() command: UpsertCategoryCommand,
    @GetUser() user: JWTToken
  ): Promise<boolean> {
    return await this.upsert.handle(command);
  }

  @Delete(":id")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async removeCategory(@Param("id") id: number): Promise<boolean> {
    const cmd: RemoveCategoryCommand = { id } as RemoveCategoryCommand;
    return await this.remove.handle(cmd);
  }

  @Delete(":mainId/sub/:subId")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async removeSubCategory(
    @Param("mainId") mainId: number,
    @Param("subId") subId: number
  ): Promise<boolean> {
    // remove the subcategory row directly
    // ensure the sub exists and belongs to the mainId
    // find subcategory
    const sub = await this.getAll.handle();
    // getAll returns shaped DTOs
    const baseCats = sub as any[];
    const foundMain = baseCats.find((c) => c.id === Number(mainId));
    if (!foundMain) return false;
    const found = (foundMain.subcategories || []).find(
      (s: any) => s.id === Number(subId)
    );
    if (!found) return false;
    // delegate to repository to remove the subcategory by id
    return await this.remove.handle({ id: Number(subId) } as any);
  }
}
