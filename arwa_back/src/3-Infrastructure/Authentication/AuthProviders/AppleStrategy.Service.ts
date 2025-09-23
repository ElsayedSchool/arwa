import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { AuthProvider } from 'src/2-Domain';
import { UserData } from '../AuthModels/user-data-model';

@Injectable()
export class AppleStragey extends PassportStrategy(Strategy, 'apple') {
  constructor(private configSer: ConfigService) {
    super({
      clientID: configSer.get('AUTH_APPLE_CLIENT_ID'),
      clientSecret: configSer.get('AUTH_APPLE_SECRET'),
      callbackURL: configSer.get('AUTH_APPLE_CALLBACKURL'),
    });
  }

  async validate(jwtPayload: any, done: VerifyCallback): Promise<UserData> {
    const userData = new UserData();
    userData.id = jwtPayload.sub;
    userData.firstName = jwtPayload.given_name;
    userData.lastName = jwtPayload.family_name;
    userData.email = jwtPayload.email;
    userData.photo = '';
    userData.provider = AuthProvider.Apple;
    return userData;
  }
  catch(err) {
    console.log(err);
    return err;
  }
}
