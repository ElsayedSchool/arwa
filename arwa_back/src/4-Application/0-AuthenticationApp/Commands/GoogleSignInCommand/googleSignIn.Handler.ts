import { Injectable } from '@nestjs/common';
import { GoogleSignInCommand } from './googleSignIn.Command';
import { AuthService } from '../../auth.service';
import { TokenValidator } from 'src/3-Infrastructure/Authentication/Services/token-validator.Service';

@Injectable()
export class GoogleSignInHandler {
  constructor(private authSer: AuthService, private tokenVal: TokenValidator) {}

  async handle(command: GoogleSignInCommand) {
    // validate token of provider
    const user = await this.tokenVal.validateGoogleToken(
      command.token,
      command.isIos,
    );

    // add fcm token
    user.fcmToken = command.fcmToken;

    // valid token
    return await this.authSer.loginWithProvider(user);
  }
}
