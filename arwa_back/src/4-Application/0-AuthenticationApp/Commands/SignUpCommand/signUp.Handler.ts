import { UserRepo } from "src/3-Infrastructure/Repositories";
import { SignUpCommand } from "./signUp.Command";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthService } from "../../auth.service";
import { UserData } from "src/3-Infrastructure/Authentication/AuthModels/user-data-model";
import { RespDto } from "src/1-Core/Models/response.model";
import { BcryptService } from "src/3-Infrastructure/Authentication/Bcrypt/bycrypt.Service";
import { TimeService } from "src/3-Infrastructure/timeService/time.service";
import { MailService } from "src/3-Infrastructure/MailApi/mail.service";
import { NotificationService } from "src/3-Infrastructure/Notification/notification.Service";
import { TranslateService } from "src/3-Infrastructure/Translation/translation.service";
import { AuthProvider } from "src/2-Domain/Enums/index";

@Injectable()
export class SignUpHandler {
  constructor(
    private authRepo: UserRepo,
    private authSer: AuthService,
    private bcryptSer: BcryptService,
    private timeSer: TimeService,
    private mailSer: MailService,
    private notiSer: NotificationService,
    private transSer: TranslateService
  ) {}

  async handle(command: SignUpCommand): Promise<RespDto> {
    const user = await this.authRepo.getUserByIdAndProvider(
      command.username.toLowerCase(),
      AuthProvider.Credential
    );
    if (user)
      throw new BadRequestException(
        this.transSer.trans("t.user_already_signin")
      );

    const isEmailExist = await this.authRepo.isEmailExist(
      command.email.toLowerCase()
    );
    if (isEmailExist)
      throw new BadRequestException(
        this.transSer.trans("t.user_already_signin")
      );
    const userReqData = new UserData();
    userReqData.name = command.username.toLowerCase();
    userReqData.email = command.email.toLowerCase();
    userReqData.fcmToken = command.fcmToken;
    userReqData.provider = AuthProvider.Credential;
    const userData = await this.authSer.createNewUser(
      userReqData,
      command.password,
      command.username.toLowerCase()
    );
    // generate verification code
    const code = await this.bcryptSer.getRandomCode();
    const hashedCode = await this.bcryptSer.getHashedVerificationCode(code);

    // hash it and save it in databse with expiration date
    userData.verificationCode = hashedCode;
    userData.verificationCodeExpirationDate = this.timeSer.getDateAfterNow(
      0,
      0,
      15
    );
    const newSavedUser = await this.authRepo.saveUserAsync(userData);

    // get id of this email and send it back to front for sending it back with verification code
    // send it with email
    await this.mailSer.sendMail(
      newSavedUser.email,
      "Email Verification For FEL Sport App",
      "",
      parseInt(code)
    );

    // add fcmToken to firebase
    await this.notiSer.AddUsertoMainTopic(command.fcmToken);
    // return response
    return new RespDto().getOkResponse(newSavedUser.id);
  }
}
