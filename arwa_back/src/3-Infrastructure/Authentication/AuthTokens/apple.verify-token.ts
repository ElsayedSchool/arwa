import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserData } from '../AuthModels/user-data-model';
import { AuthProvider } from 'src/2-Domain';
import { Logger } from 'winston';
import verifyAppleToken from 'verify-apple-id-token';
import { TranslateService } from 'src/3-Infrastructure/Translation/translation.service';
import { error } from 'console';

@Injectable()
export class VerifyAppleIdToken {
  clientId = this.configSer.get('AUTH_APPLE_CLIENT_ID');
  constructor(
    private configSer: ConfigService,
    @Inject('Logger') private log: Logger,
    private transSer: TranslateService,
  ) {}
  async verify(token: string) {
    try {
      const resp = await verifyAppleToken({
        idToken: token,
        clientId: this.clientId,
      });
      const userData = new UserData();
      userData.provider = AuthProvider.Apple;
      userData.id = resp.sub;
      userData.email = resp.email;
      userData.firstName = '';
      userData.lastName = '';
      userData.name = '';
      userData.photo = '';
      return userData;
    } catch (err) {
      this.log.error('Apple Sign in Error', error);
      throw new UnauthorizedException(
        this.transSer.trans('t.apple_login_unauth'),
      );
    }
  }
}
