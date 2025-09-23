import { Category } from 'src/2-Domain';
import { IBaseRepository } from '../Base/base.interface.repository';
import { BaseRepository } from '../Base/base.abstract.repository';
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'winston';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICategoryRepo extends IBaseRepository<Category> {}

export class CategoryRepo
  extends BaseRepository<Category>
  implements ICategoryRepo
{
  constructor(
    @InjectRepository(Category)
    private db: Repository<Category>,
    @Inject('Logger') private log: Logger,
  ) {
    super(db, log);
  }

  async saveCategoryAsync(category: Category) {
    try {
      const result = await this.db.save(category);
      return !result == false;
    } catch (err) {
      this.log.error(err, typeof err?.code);
      if (err?.code === '23505') {
        throw new BadRequestException(`هذا النوع تم تسجيله من قبل`);
      } else if (err?.code === '22001') {
        throw new BadRequestException(
          'الاسم الخاص بالنوع يجب ان لا يزيد عن 30 حرف',
        );
      } else {
        throw new InternalServerErrorException(
          'حدث خطا اثناء حفظ البيانات الجديده برجاء المحاوله مره اخرى',
        );
      }
    }
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.db.find();
  }
}
