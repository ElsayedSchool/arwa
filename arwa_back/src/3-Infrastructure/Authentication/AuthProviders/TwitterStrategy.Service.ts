/* import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';
import { AuthProvider } from 'src/2-Domain';
import { UserData } from '../AuthModels/user-data-model';

@Injectable()
export class TwitterStragey extends PassportStrategy(Strategy, 'twitter') {
  constructor(private configSer: ConfigService) {
    super({
      consumerKey: configSer.get('AUTH_TWITTER_CLIENT_ID'),
      consumerSecret: configSer.get('AUTH_TWITTER_SECRET'),
      callbackURL: configSer.get('AUTH_TWITTER_CALLBACKURL'),
      includeEmail: true,
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<UserData> {
    const { id, username, displayName, emails, photos } = profile;
    const userData = new UserData();
    userData.id = profile.id;
    userData.firstName = (username as string).split(' ')[0];
    userData.lastName = username;
    userData.email = emails ? emails[0].value : '';
    userData.photo = photos.length > 0 ? photos[0].value : '';
    userData.provider = AuthProvider.Twitter;
    return userData;
  }
  catch(err) {
    console.log(err);
    return err;
  }
}
 */
