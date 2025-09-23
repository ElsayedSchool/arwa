import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { DeactivateUserCommand } from './deactivateUser.Command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeactivateUserHandler {
  constructor(private userRepo: UserRepo) {}

  async handle(command: DeactivateUserCommand): Promise<boolean> {
    const user = await this.userRepo.findByIdAsync(command.id);
    user.isActive = command.isActive;
    return await this.userRepo.saveAsync(user);
  }
}
