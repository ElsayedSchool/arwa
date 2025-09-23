import { VisitorSignInCommand } from "./visitorSignIn.Command";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../../auth.service";
import { RespDto } from "src/1-Core/Models/response.model";
import { authResponseVm } from "../../auth-response.vm";
import { User, UserProfile, UserRole } from "src/2-Domain";

@Injectable()
export class VisitorSignInHandler {
  constructor(private authSer: AuthService) {}

  async handle(command: VisitorSignInCommand): Promise<RespDto> {
    const user = new User();
    user.id = "00000000-0000-0000-0000-000000000000";
    const profile = new UserProfile();
    user.email = "visitor@felapp.com";
    user.userProfile = profile;
    user.roles = [UserRole.Visitor];
    user.isActive = true;
    const token = new RespDto().getOkResponse(
      new authResponseVm(
        await this.authSer.createJWTToken(user),
        "",
        user.isProfileInit,
        true
      )
    );
    return token;
    // return response
  }
}
