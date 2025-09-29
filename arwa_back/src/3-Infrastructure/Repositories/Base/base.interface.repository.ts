import { DeepPartial, FindManyOptions } from "typeorm";

export interface IHasId {
  id: number | string;
}

export interface IBaseRepository<T extends IHasId> {
  getAllAsync(): Promise<T[]>;
  saveAsync(data: DeepPartial<T>): Promise<T>;
  saveManyAsync(data: DeepPartial<T>[]): Promise<boolean>;
  findByIdAsync(id: any): Promise<T>;
  findAllAsync(filterOptions: FindManyOptions<T>): Promise<Array<T>>;
  removeByIdAsync(id: any): Promise<boolean>;
}
