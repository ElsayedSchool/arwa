import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/3-Infrastructure/Repositories';

@Injectable()
export class GetAllUsersHandler {
  constructor(private userRepo: UserRepo) {}
  async handle() {
    return await this.userRepo.getAllAdminUsers();
  }
}
