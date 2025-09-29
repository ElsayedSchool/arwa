import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { IBaseRepository, IHasId } from "./base.interface.repository";
import { Logger } from "winston";
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

export abstract class BaseRepository<T extends IHasId>
  implements IBaseRepository<T>
{
  private readonly repo: Repository<T>;
  constructor(
    entity: Repository<T>,
    private logger: Logger
  ) {
    this.repo = entity;
  }

  public async saveAsync(data: DeepPartial<T>): Promise<T> {
    try {
      const result = await this.repo.save(data);
      return result;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        "حدث خطا اثناء حفظ البيانات الجديده برجاء المحاوله مره اخرى"
      );
    }
  }

  public async saveManyAsync(data: DeepPartial<T>[]): Promise<boolean> {
    try {
      const result = await this.repo.save(data);
      return result?.length == 0 ? false : true;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        "حدث خطا اثناء حفظ البيانات الجديده برجاء المحاوله مره اخرى"
      );
    }
  }

  public async getAllAsync(): Promise<T[]> {
    try {
      return await this.repo.find();
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاع البيانات برجاء المحاوله مره اخرى"
      );
    }
  }

  public async findByIdAsync(id: any): Promise<T> {
    try {
      const resp = await this.repo.findOneBy({
        id: id,
      } as FindOptionsWhere<T>);
      if (!resp) throw new BadRequestException("من فضلك ارسل بيانات صحيحه");
      return resp;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  public async findAllAsync(filterOptions: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repo.find(filterOptions);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        "حدث خطا اثناء استرجاع البيانات برجاء المحاوله مره اخرى"
      );
    }
  }

  public async removeByIdAsync(id: any): Promise<boolean> {
    try {
      const resp = await this.repo.delete(id);
      return resp.affected >= 1;
    } catch (err) {
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

  public getRaw(): Repository<T> {
    return this.repo;
  }

  public async findActive(options?: any): Promise<T[]> {
    return this.repo.find({ where: { isDeleted: false }, ...options });
  }

  public async findOneActive(options: any): Promise<T | null> {
    return this.repo.findOne({ where: { isDeleted: false }, ...options });
  }

  public async softDelete(
    id: string,
    deletedById?: string,
    deletedByName?: string
  ): Promise<boolean> {
    try {
      const updateData: any = { isDeleted: true, deletedAt: new Date() };
      if (deletedById) updateData.deletedBy = deletedById;
      if (deletedByName) updateData.deletedByName = deletedByName;

      const resp = await this.repo.update(id, updateData);
      return resp.affected >= 1;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(
        "حدث خطا اثناء حذف البيانات برجاء المحاوله مره اخرى"
      );
    }
  }
}
