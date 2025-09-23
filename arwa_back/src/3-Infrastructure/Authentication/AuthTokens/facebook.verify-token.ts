import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserData } from '../AuthModels/user-data-model';
import { AuthProvider } from 'src/2-Domain';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Logger } from 'winston';
@Injectable()
export class VerifyFacebookIdToken {
  clientId = this.configSer.get('AUTH_FACEBOOK_CLIENT_ID');
  constructor(
    private configSer: ConfigService,
    private http: HttpService,
    @Inject('Logger') private log: Logger,
  ) {}
  async verify(token: string) {
    try {
      // check if token is valid
      const respData = await this.verifyTokenData(token);
      // get id,name,email from token
      const userdata = await this.getUserData(token);
      console.log(userdata);
      const userData = new UserData();
      userData.provider = AuthProvider.FaceBook;
      userData.id = userdata['id'];
      userData.email = userdata['email'] ?? null;
      userData.firstName = '';
      userData.lastName = '';
      userData.name = userdata['name'];
      userData.photo = '';
      return userData;
    } catch (err) {
      throw new UnauthorizedException(
        'من فضلك قم بتسجيل الدخول الى حساب فيسبوك',
      );
    }
  }

  private async verifyTokenData(token: string) {
    const resp = await lastValueFrom(
      this.http
        .get(
          `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${this.configSer.get(
            'AUTH_FACEBOOK_CLIENT_ID',
          )}|${this.configSer.get('AUTH_FACEBOOK_SECRET')}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.log.error(error.message, 'error in verify data');
            throw 'An error happened!';
          }),
        ),
    );
    const respData = resp['data']['data'];
    if (!respData['is_valid']) {
      this.log.error('unauthorized user', resp?.data['errors']);
      throw new UnauthorizedException(
        'من فضلك قم بتسجيل الدخول الى حساب فيسبوك',
      );
    }
    return respData;
  }

  async getUserData(token: string) {
    const resp = await lastValueFrom(
      this.http
        .get(
          `https://graph.facebook.com/v13.0/me?fields=id,name,email&access_token=${token}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw 'An error happened! when getting user data while logging with facebook';
          }),
        ),
    );
    return resp['data'];
  }
}
