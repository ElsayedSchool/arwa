import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-jwt';
import { AuthProvider } from 'src/2-Domain';
import { UserData } from '../AuthModels/user-data-model';

@Injectable()
export class GoogleStragey extends PassportStrategy(Strategy, 'google') {
  constructor(private configSer: ConfigService) {
    super({
      clientID: configSer.get('AUTH_GOOGLE_CLIENT_ID'),
      clientSecret: configSer.get('AUTH_GOOGLE_SECRET'),
      callbackURL: configSer.get('AUTH_GOOGLE_CALLBACKURL'), //'http://localhost:3000/api/authentication/google/callback',
      passReqToCallback: true, // allows us to access the req object in the verify function
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<UserData> {
    const { name, emails, photos } = profile;
    const userData = new UserData();
    userData.id = profile.id;
    userData.firstName = name.givenName;
    userData.lastName = name.familyName;
    userData.email = emails[0].value;
    userData.photo = photos[0]?.value || '';
    userData.provider = AuthProvider.Google;
    return userData;
  }
  catch(err) {
    throw new InternalServerErrorException(err);
  }
}
