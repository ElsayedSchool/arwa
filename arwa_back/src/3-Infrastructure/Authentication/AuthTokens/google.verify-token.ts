import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserData } from '../AuthModels/user-data-model';
import { AuthProvider } from 'src/2-Domain';
import { OAuth2Client } from 'google-auth-library';
import { TranslateService } from 'src/3-Infrastructure/Translation/translation.service';
@Injectable()
export class VerifyGoogleIdToken {
  constructor(
    private configSer: ConfigService,
    private transSer: TranslateService,
  ) {}
  async verify(token: string, isIos: boolean) {
    try {
      const client = new OAuth2Client();
      let ticket: any;
      if (isIos) {
        ticket = await client.verifyIdToken({
          idToken: token,
          audience: this.configSer.get('AUTH_GOOGLE_APPLE_CLIENT_ID'), // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
      } else {
        ticket = await client.verifyIdToken({
          idToken: token,
          audience: this.configSer.get('AUTH_GOOGLE_CLIENT_ID'), // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
      }
      const payload = ticket.getPayload();
      this.checkIssuerAndAudience(payload, isIos);
      const userData = new UserData();
      userData.id = payload['sub'];
      userData.firstName = payload['name'];
      userData.lastName = payload['family_name'];
      userData.email = payload['email'];
      userData.photo = payload['picture'];
      userData.provider = AuthProvider.Google;
      return userData;
    } catch (err) {
      throw new UnauthorizedException(
        this.transSer.trans('t.google_login_unauth'),
      );
    }
  }

  private checkIssuerAndAudience(payload: any, isIos: boolean) {
    const issuer = payload['iss'];
    const audience = payload['aud'];
    const azp = payload['azp'];

    if (isIos) {
      if (
        azp != this.configSer.get('AUTH_GOOGLE_APPLE_CLIENT_ID') ||
        issuer != 'https://accounts.google.com' ||
        audience != this.configSer.get('AUTH_GOOGLE_APPLE_CLIENT_ID')
      )
        throw new UnauthorizedException(
          this.transSer.trans('t.apple_login_unauth'),
        );
    } else {
      if (
        azp != this.configSer.get('AUTH_GOOGLE_ANDROID_CLIENT_ID') ||
        issuer != 'https://accounts.google.com' ||
        audience != this.configSer.get('AUTH_GOOGLE_CLIENT_ID')
      )
        throw new UnauthorizedException(
          this.transSer.trans('t.google_login_unauth'),
        );
    }
    return true;
  }
}
