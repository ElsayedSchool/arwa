import { Injectable } from '@nestjs/common';
import { UserData } from 'src/3-Infrastructure/Authentication/AuthModels/user-data-model';

@Injectable()
export class TwitterSignInCommand {
  constructor(public authUser: UserData) {}
}
