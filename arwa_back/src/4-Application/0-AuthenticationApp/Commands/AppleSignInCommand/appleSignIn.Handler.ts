import { Injectable } from "@nestjs/common";
import { AppleSignInCommand } from "./appleSignIn.Command";
import { AuthService } from "../../auth.service";
import { TokenValidator } from "src/3-Infrastructure/Authentication/Services/token-validator.Service";

@Injectable()
export class AppleSignInHandler {
  constructor(
    private authSer: AuthService,
    private tokenVal: TokenValidator
  ) {}

  async handle(command: AppleSignInCommand) {
    // validate token of provider
    const user = await this.tokenVal.validateAppleToken(command.IdentityToken);

    user.fcmToken = command.fcmToken;
    // valid token
    return this.authSer.loginWithProvider(user);
  }
}
