import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { GetUserDetailQuery } from './getUserDetail.Query';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserDetailHandler {
  constructor(private userRepo: UserRepo) {}
  async handle(query: GetUserDetailQuery): Promise<any> {
    console.log('check it ');
    return await this.userRepo.getCouinsOfUser(query.id);
  }
}
