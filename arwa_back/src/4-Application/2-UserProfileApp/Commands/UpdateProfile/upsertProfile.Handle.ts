import { ProfileRepo, UserRepo } from "src/3-Infrastructure/Repositories";
import {
  ChangeLanguageCommand,
  UpdateProfileCommand,
} from "./upsertProfile.Command";
import { JWTToken } from "src/3-Infrastructure/Authentication/AuthModels/token.model";
import { Injectable } from "@nestjs/common";
import { RespDto } from "src/1-Core/Models/response.model";

@Injectable()
export class UpdateProfileHandler {
  constructor(private userRepo: UserRepo) {}
  async handle(
    command: UpdateProfileCommand,
    user: JWTToken
  ): Promise<RespDto> {
    const userData = await this.userRepo.getUserDetailById(user.id);
    userData.isProfileInit = true;
    const profile = userData.userProfile;
    userData.userProfile = profile;
    return new RespDto().getOkResponse(await this.userRepo.saveAsync(userData));
  }

  async handleLanguage(
    command: ChangeLanguageCommand,
    user: JWTToken
  ): Promise<RespDto> {
    const userData = await this.userRepo.getUserDetailById(user.id);
    const profile = userData.userProfile;
    return new RespDto().getOkResponse(await this.userRepo.saveAsync(userData));
  }
}
