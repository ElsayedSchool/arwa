import { Injectable } from '@nestjs/common';

@Injectable()
export class FacebookSignInCommand {
  constructor(public accessToken: string, public fcmToken: string) {}
}
