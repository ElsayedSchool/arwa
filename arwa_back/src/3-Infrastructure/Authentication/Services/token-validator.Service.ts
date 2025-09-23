import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserData } from '../AuthModels/user-data-model';
import { VerifyGoogleIdToken } from '../AuthTokens/google.verify-token';
import { VerifyFacebookIdToken } from '../AuthTokens/facebook.verify-token';
import { VerifyAppleIdToken } from '../AuthTokens/apple.verify-token';
import { bool, boolean } from 'joi';

@Injectable()
export class TokenValidator {
  constructor(
    private googleValid: VerifyGoogleIdToken,
    private facebookValid: VerifyFacebookIdToken,
    private appleValid: VerifyAppleIdToken,
  ) {}
  async validateGoogleToken(
    idToken: string,
    isIos: boolean,
  ): Promise<UserData> {
    return await this.googleValid.verify(idToken, isIos);
  }

  async validateFacebookToken(accessToken: string): Promise<UserData> {
    return await this.facebookValid.verify(accessToken);
  }

  async validateAppleToken(token: string): Promise<UserData> {
    return await this.appleValid.verify(token);
  }
}
