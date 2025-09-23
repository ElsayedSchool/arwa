import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { RespDto } from "src/1-Core/Models/response.model";
import { AuthProvider, User, UserProfile, UserRole } from "src/2-Domain";
import { JWTToken } from "src/3-Infrastructure/Authentication/AuthModels/token.model";
import { UserData } from "src/3-Infrastructure/Authentication/AuthModels/user-data-model";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { AppJWTService } from "src/3-Infrastructure/Authentication/JWT/JWT.Service";
import { ProfileRepo, UserRepo } from "src/3-Infrastructure/Repositories";
import { authResponseVm } from "./auth-response.vm";
import { NotificationService } from "src/3-Infrastructure/Notification/notification.Service";

@Injectable()
export class AuthService {
  constructor(
    private jwtSer: AppJWTService,
    private hashSer: BcryptService,
    private authRepo: UserRepo,
    private profileRepo: ProfileRepo,
    private notiSer: NotificationService
  ) {}

  async createJWTToken(user: User): Promise<string> {
    const payload: JWTToken = new JWTToken(
      user.id,
      "",
      user.isActive,
      user.roles
    ); // to modify Token Content
    const token = await this.jwtSer.getJwtToken({ ...payload });
    return token;
  }

  async createRefreshToken(user: User): Promise<string> {
    const payload: any = { id: user.id };
    return await this.jwtSer.getRefreshToken(payload);
  }

  async createNewUser(
    user: UserData,
    password = "",
    username = ""
  ): Promise<User> {
    const userData = new User();
    if (user.provider != AuthProvider.Credential) {
      userData.userProviderId = user.id;
      userData.emailConfirmed = true;
    } else {
      userData.username = username;
      userData.emailConfirmed = false;
    }
    userData.email = user.email?.toLowerCase();
    userData.roles = [UserRole.User];
    userData.authProvider = user.provider;
    if (password && typeof password === "string") {
      userData.authProvider = AuthProvider.Credential;
      userData.password = await this.hashSer.getHashedPassword(password);
    }

    const profile = new UserProfile();
    profile.fcmToken = user.fcmToken;

    userData.userProfile = profile;
    return userData;
  }

  async getUserByEmail(
    providerId: string,
    provider: AuthProvider
  ): Promise<User> {
    return await this.authRepo.getUserByProviderAndProviderId(
      providerId,
      provider
    );
  }

  async loginWithProvider(userData: UserData): Promise<RespDto> {
    //check if email exists
    const user = await this.authRepo.getUserByEmail(
      userData.email?.toLowerCase()
    );

    // email exists
    if (user) {
      if (user.userProfile) {
        const profile = user.userProfile;
        if (profile.fcmToken != userData.fcmToken) {
          await this.notiSer.UpdateUsertoMainTopic(
            profile.fcmToken,
            userData.fcmToken
          );
          profile.fcmToken = userData.fcmToken;
          await this.profileRepo.saveAsync(profile);
        }
      }
      if (!user.userProviderId) {
        user.userProviderId = userData.id;
        await this.authRepo.saveAsync(user);
      }
      return new RespDto().getOkResponse(
        new authResponseVm(
          await this.createJWTToken(user),
          await this.getRefreshToken(user),
          user.isProfileInit,
          user.emailConfirmed
        )
      );
    }
    // new User
    const newUser = await this.createNewUser(userData);

    const isCreated = await this.authRepo.saveAsync(newUser);

    // create webtoken for the new User
    if (!isCreated) {
      throw new InternalServerErrorException(
        "حدث خطا اثناء حفظ البيانات برجاء المحاوله مره اخرى"
      );
    }
    const updatedUser = await this.getUserByEmail(
      userData.id,
      userData.provider
    );

    // return webtoken
    return new RespDto().getOkResponse({
      token: await this.createJWTToken(updatedUser),
      refreshToken: await this.getRefreshToken(updatedUser),
      isProfileInit: updatedUser.isProfileInit,
    });
  }

  async getRefreshToken(user: User) {
    const refreshToken = await this.jwtSer.getRefreshToken({ id: user.id });
    user.refreshToken = refreshToken;
    await this.authRepo.saveAsync(user);
    return refreshToken;
  }

  async getResetPasswordToken(user: User) {
    const payload: JWTToken = new JWTToken(
      user.id,
      "",
      user.isActive,
      user.roles
    );
    return await this.jwtSer.getToken({ ...payload }, 60);
  }
}
