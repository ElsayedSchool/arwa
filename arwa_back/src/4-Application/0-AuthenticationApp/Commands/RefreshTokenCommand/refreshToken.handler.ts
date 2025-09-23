import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppJWTService } from 'src/3-Infrastructure/Authentication/JWT/JWT.Service';
import { RefreshTokenCommand } from './refreshToken.Command';
import { UserRepo } from 'src/3-Infrastructure/Repositories';
import { AuthService } from '../../auth.service';
import { RespDto } from 'src/1-Core/Models/response.model';
import { authResponseVm } from '../../auth-response.vm';
import { TranslateService } from 'src/3-Infrastructure/Translation/translation.service';

@Injectable()
export class RefreshTokenHandler {
  constructor(
    private readonly jwtSer: AppJWTService,
    private authSer: AuthService,
    private userRepo: UserRepo,
    private transSer: TranslateService,
  ) {}
  async handle(command: RefreshTokenCommand) {
    try {
      const { id } = await this.jwtSer.VerifyRefreshToken(command.refreshToken);
      const user = await this.userRepo.getUserByIdAndRefreshToken(
        id,
        command.refreshToken,
      );
      if (!user)
        throw new UnauthorizedException(this.transSer.trans('t.user_relogin'));
      const refreshToken = await this.authSer.createRefreshToken(user);
      user.refreshToken = refreshToken;
      if (user.userProfile) user.userProfile.fcmToken = command.fcmToken;
      await this.userRepo.saveAsync(user);
      const token = new RespDto().getOkResponse(
        new authResponseVm(
          await this.authSer.createJWTToken(user),
          refreshToken,
          user.isProfileInit,
          user.emailConfirmed,
        ),
      );
      return token;
    } catch (error) {
      throw new UnauthorizedException(this.transSer.trans('t.user_relogin'));
    }
  }
}
