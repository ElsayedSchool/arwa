import { Category } from "src/2-Domain";
import { IBaseRepository } from "../Base/base.interface.repository";
import { BaseRepository } from "../Base/base.abstract.repository";
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Logger } from "winston";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICategoryRepo extends IBaseRepository<Category> {
  findByIdWithRelations(
    id: number,
    relations: string[]
  ): Promise<Category | null>;
}

export class CategoryRepo
  extends BaseRepository<Category>
  implements ICategoryRepo
{
  constructor(
    @InjectRepository(Category)
    private db: Repository<Category>,
    @Inject("Logger") private log: Logger
  ) {
    super(db, log);
  }

  async saveCategoryAsync(category: Category) {
    try {
      const result = await this.db.save(category);
      return !result == false;
    } catch (err) {
      this.log.error(err, typeof err?.code);
      if (err?.code === "23505") {
        throw new BadRequestException(`هذا النوع تم تسجيله من قبل`);
      } else if (err?.code === "22001") {
        throw new BadRequestException(
          "الاسم الخاص بالنوع يجب ان لا يزيد عن 30 حرف"
        );
      } else {
        throw new InternalServerErrorException(
          "حدث خطا اثناء حفظ البيانات الجديده برجاء المحاوله مره اخرى"
        );
      }
    }
  }

  async getAllCategories(): Promise<Category[]> {
    // Return only base categories and include ONLY non-deleted subcategories
    return await this.db
      .createQueryBuilder("category")
      .where("category.isDeleted = false AND category.isBase = true")
      .leftJoinAndSelect(
        "category.subcategories",
        "sub",
        "sub.isDeleted = false"
      )
      .orderBy("category.name", "ASC")
      .addOrderBy("sub.name", "ASC")
      .getMany();
  }

  async findByIdWithRelations(
    id: number,
    relations: string[] = []
  ): Promise<Category | null> {
    try {
      return await this.db.findOne({
        where: { id, isDeleted: false },
        relations: relations,
      });
    } catch (err) {
      this.log.error(err);
      throw new InternalServerErrorException("حدث خطا اثناء استرجاع البيانات");
    }
  }

  /**
   * Soft remove a category by id (mark isDeleted, set deletedAt and deletedBy)
   */
  async softRemoveByIdAsync(id: number, deletedBy?: string | null) {
    try {
      // use a transaction to soft-delete the category and cascade to its subcategories
      return await this.db.manager.transaction(async (manager) => {
        const category = await manager.findOne(Category, { where: { id } });
        if (!category) return false;
        category.isDeleted = true;
        category.deletedAt = new Date();
        category.deletedBy = deletedBy || null;
        await manager.save(Category, category);

        // if this is a base category, soft-delete its subcategories as well
        if (category.isBase) {
          const subs = await manager.find(Category, {
            where: { mainCategoryId: category.id, isDeleted: false },
          });
          for (const s of subs) {
            s.isDeleted = true;
            s.deletedAt = new Date();
            s.deletedBy = deletedBy || null;
            await manager.save(Category, s);
          }
        }

        return true;
      });
    } catch (err) {
      this.log.error(err);
      if (err?.code === "23502" || err?.code === "23503") {
        throw new BadRequestException(
          "لا يمكن اتمام الحذف, توجد بيانات مرتبطه به فى قاعده البيانات"
        );
      } else {
        throw new InternalServerErrorException(
          "حدث خطا اثناء حذف البيانات برجاء المحاوله مره اخرى"
        );
      }
    }
  }
}
