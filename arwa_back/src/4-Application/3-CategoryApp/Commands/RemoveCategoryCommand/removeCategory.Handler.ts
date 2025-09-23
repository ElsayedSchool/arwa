import { RemoveCategoryCommand } from './removeCategory.Command';
import { Injectable } from '@nestjs/common';
import { CategoryRepo } from 'src/3-Infrastructure/Repositories';

@Injectable()
export class RemoveCategoryCommandHandler {
  constructor(private categoryRepo: CategoryRepo) {}
  async handle(command: RemoveCategoryCommand): Promise<boolean> {
    return await this.categoryRepo.removeByIdAsync(command.id);
  }
}
