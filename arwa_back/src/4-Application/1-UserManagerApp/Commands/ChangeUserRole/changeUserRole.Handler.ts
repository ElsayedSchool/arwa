import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { ChangeUserRoleCommand } from './changeUserRole.Command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChangeUserRoleHandler {
  constructor(private userRepo: UserRepo) {}
  async handle(command: ChangeUserRoleCommand): Promise<boolean> {
    const user = await this.userRepo.findByIdAsync(command.id);
    user.isAdmin = command.isAdmin;
    user.roles = command.roles;
    return await this.userRepo.saveAsync(user);
  }
}
