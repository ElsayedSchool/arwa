import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleSignInCommand {
  token: string;
  isIos: boolean;
  fcmToken: string;
}
