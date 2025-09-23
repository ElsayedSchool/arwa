import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { FacebookSignInCommand } from '../FacebookSignInCommand/facebookSignIn.Command';
import { TokenValidator } from 'src/3-Infrastructure/Authentication/Services/token-validator.Service';

@Injectable()
export class FacebookSignInHandler {
  constructor(private authSer: AuthService, private tokenVal: TokenValidator) {}

  async handle(command: FacebookSignInCommand) {
    // validate token of provider
    const user = await this.tokenVal.validateFacebookToken(command.accessToken);

    // add fcm token
    user.fcmToken = command.fcmToken;

    // valid token
    return this.authSer.loginWithProvider(user);
  }
}
