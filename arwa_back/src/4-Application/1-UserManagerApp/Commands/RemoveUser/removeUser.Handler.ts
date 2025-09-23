import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { RemoveUserCommand } from './removeUser.Command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveUserHandler {
  constructor(private userRepo: UserRepo) {}
  async handle(command: RemoveUserCommand): Promise<boolean> {
    return await this.userRepo.removeByIdAsync(command.id);
  }
}
