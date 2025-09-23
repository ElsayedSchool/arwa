/* import { Injectable } from '@nestjs/common';
import { TwitterSignInCommand } from './twitterSignIn.Command';
import { AuthService } from '../../auth.service';
import { TokenValidator } from 'src/3-Infrastructure/Authentication/Services/token-validator.Service';

@Injectable()
export class TwitterSignInHandler {
  constructor(private authSer: AuthService, private tokenVal: TokenValidator) {}

  async handle(command: TwitterSignInCommand) {
    // validate token of provider
    const user = await this.tokenVal.validateTwitterToken();

    // valid token
    return this.authSer.loginWithProvider(user);
  }
} */
