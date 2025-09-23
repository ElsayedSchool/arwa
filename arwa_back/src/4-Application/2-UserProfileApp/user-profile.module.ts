import { Module } from "@nestjs/common";
import { UserProfileController } from "./user-profile.controller";
import { InfrastructureModule } from "src/3-Infrastructure/Infrastructure.Module";
import { UpdateProfileHandler } from "./Commands/UpdateProfile/upsertProfile.Handle";
import { RemoveProfileHandler } from "./Commands/RemoveProfile/removeProfile.Handle";
import { UpdateUserPhotosHandler } from "./Commands/UpdateUserPhotos/updateUserPhotos.Handler";
import { ChangePassInAppHandler } from "./Commands/ChangePassInAppCommand/changePassInApp.Handler";
import { SignOutHandler } from "./Commands/SignOutCommand/signOut.Handler";
import { RemoveUserHandler } from "./Commands/RemoveUser/removeUser.Handler";
import { AuthService } from "../0-AuthenticationApp/auth.service";
import { GetAllUsersQueryHander } from "./Queries/GetAllUsers/getAllUsers.Handler";

@Module({
  imports: [InfrastructureModule],
  providers: [
    UpdateProfileHandler,
    RemoveProfileHandler,
    UpdateUserPhotosHandler,
    ChangePassInAppHandler,
    SignOutHandler,
    RemoveUserHandler,
    AuthService,
    GetAllUsersQueryHander,
  ],
  controllers: [UserProfileController],
  exports: [],
})
export class UserProfileModule {}
