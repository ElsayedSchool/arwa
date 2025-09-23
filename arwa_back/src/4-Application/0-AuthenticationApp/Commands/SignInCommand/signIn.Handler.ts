import { UserRepo } from "src/3-Infrastructure/Repositories";
import { SignInCommand } from "./signIn.Command";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../../auth.service";
import { RespDto } from "src/1-Core/Models/response.model";
import { authResponseVm } from "../../auth-response.vm";
import { NotificationService } from "src/3-Infrastructure/Notification/notification.Service";
import { TranslateService } from "src/3-Infrastructure/Translation/translation.service";

@Injectable()
export class SignInHandler {
  constructor(
    private readonly authRepo: UserRepo,
    private hashSer: BcryptService,
    private authSer: AuthService,
    private notiSer: NotificationService,
    private transSer: TranslateService
  ) {}

  async handle(command: SignInCommand): Promise<RespDto> {
    // check username
    const user = await this.authRepo.getUserByUsername(
      command.username.toLowerCase()
    );
    if (!user)
      return new RespDto().getBadRequest(
        `${this.transSer.trans("t.credential_error")}`
      );
    // check password
    const isPasswordCorrect = await this.hashSer.isPasswordValid(
      command.password,
      user.password
    );
    if (!isPasswordCorrect)
      return new RespDto().getBadRequest(
        `${this.transSer.trans("t.credential_error")}`
      );

    if (!user.isActive)
      return new RespDto().getunAuthorizedRequest(
        "تم ايقاف تفعيل الحساب من فضلك تواصل مع اداره الموقع لمزيد من التفاصيل"
      );

    /*   if (!user.emailConfirmed || false)
      return new RespDto().getunAuthorizedRequest(
        'لا يمكن تسجيل الدخول قبل تاكيد الايميل الخاص بك, من فضلك قم بفحص الايميل الخاص بك',
      ); */
    const refreshToken = await this.authSer.createRefreshToken(user);
    user.refreshToken = refreshToken;
    const isStored = await this.authRepo.saveAsync(user);
    const token = new RespDto().getOkResponse(
      new authResponseVm(
        await this.authSer.createJWTToken(user),
        refreshToken,
        user.isProfileInit,
        user.emailConfirmed
      )
    );
    return token;
    // return response
  }
}
