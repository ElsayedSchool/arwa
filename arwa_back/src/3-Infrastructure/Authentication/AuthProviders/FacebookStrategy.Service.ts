import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { VerifyCallback } from 'passport-jwt';
import { AuthProvider } from 'src/2-Domain';
import { UserData } from '../AuthModels/user-data-model';

@Injectable()
export class FaceBookStragey extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configSer: ConfigService) {
    super({
      clientID: configSer.get('AUTH_FACEBOOK_CLIENT_ID'),
      clientSecret: configSer.get('AUTH_FACEBOOK_SECRET'),
      callbackURL: configSer.get('AUTH_FACEBOOK_CALLBACKURL'), //'http://localhost:3000/api/authentication/google/callback',
      passReqToCallback: true, // allows us to access the req object in the verify function
      profileFields: ['id', 'emails', 'name'],
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
    userData.email = emails ? emails[0].value : ''; // Facebook can return multiple emails, so you might want to handle this accordingly.
    userData.firstName = name.givenName;
    userData.lastName = name.familyName;
    userData.photo = photos.length > 0 ? photos[0].value : '';
    userData.provider = AuthProvider.FaceBook;
    return userData;
  }
  catch(err) {
    console.log(err);
    return err;
  }
}
