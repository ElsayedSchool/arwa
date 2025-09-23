import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { RemoveProfileHandler } from "./Commands/RemoveProfile/removeProfile.Handle";
import {
  ChangeLanguageCommand,
  UpdateProfileCommand,
} from "./Commands/UpdateProfile/upsertProfile.Command";
import { UpdateProfileHandler } from "./Commands/UpdateProfile/upsertProfile.Handle";
import { GetUser } from "src/1-Core/Decorators/GetUser.Decorator";
import { JWTToken } from "src/3-Infrastructure/Authentication/AuthModels/token.model";
import { RemoveProfileCommand } from "./Commands/RemoveProfile/removeProfile.Command";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/1-Core/Guards/Roles.Guard";
import { Roles } from "src/3-Infrastructure/Authentication/Roles/Roles.Type";
import { RespDto } from "src/1-Core/Models/response.model";
import { SignOutHandler } from "./Commands/SignOutCommand/signOut.Handler";
import { ChangePassInAppHandler } from "./Commands/ChangePassInAppCommand/changePassInApp.Handler";
import { ChangePassInAppCommand } from "./Commands/ChangePassInAppCommand/changePassInApp.Command";
import { RemoveUserHandler } from "./Commands/RemoveUser/removeUser.Handler";
import { RemoveUserCommand } from "./Commands/RemoveUser/removeUser.Command";
import { UserRole } from "src/2-Domain";
import { GetAllUsersQuery } from "./Queries/GetAllUsers/getAllUsers.Query";
import { GetAllUsersQueryHander } from "./Queries/GetAllUsers/getAllUsers.Handler";

@Controller("profile")
export class UserProfileController {
  constructor(
    private remove: RemoveProfileHandler,
    private update: UpdateProfileHandler,
    private signOut: SignOutHandler,
    private changePassword: ChangePassInAppHandler,
    private removeUserByEmail: RemoveUserHandler,
    private allUsers: GetAllUsersQueryHander
  ) {}

  @Get("/detail")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User", "Visitor", "Admin")
  async getProfileDetailHandler(@Req() req: any, @GetUser() user: JWTToken) {
    return;
  }

  /*   @Post("/items")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User")
  async getProfileItemsDetailHandler(
    @GetUser() user: JWTToken,
    @Body() command: GetUserItemsQuery
  ) {
    return await this.getItems.handle(command, user);
  } */

  @Post("/all")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles(UserRole.Admin, UserRole.Analysis, UserRole.Supervisor)
  async getAllUsersData(@Body() command: GetAllUsersQuery) {
    return await this.allUsers.handle();
  }

  /*   @Post("/groups")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User", "Visitor")
  async getProfileGroupsDetailHandler(
    @GetUser() user: JWTToken,
    @Body() command: GetProfileGroupsQuery
  ) {
    return await this.groups.handle(command, user);
  } */

  /*   @Post("/transactions")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User")
  async getProfileTransactionDetailHandler(
    @GetUser() user: JWTToken,
    @Body() command: GetUserTransactionsQuery
  ) {
    return await this.transaction.handle(command, user);
  } */

  @Put("/update/data")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User")
  async UpdateProfileData(
    @Body() command: UpdateProfileCommand,
    @GetUser() user: JWTToken
  ): Promise<RespDto> {
    return await this.update.handle(command, user);
  }

  //change language
  @Post("/changelanguage")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User")
  async changeLanguage(
    @Body() command: ChangeLanguageCommand,
    @GetUser() user: JWTToken
  ) {
    return await this.update.handleLanguage(command, user);
  }
  /*   @Post("/updateprofilephoto")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User")
  async selectProfilePhoto(
    @Body() command: SelectProfilePhotoCommand,
    @GetUser() user: JWTToken
  ) {
    return await this.profilePhoto.handle(command, user);
  } */

  /*   @Post("/updateshirtphoto")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User")
  async SelectTShirtPhoto(
    @Body() command: SelectTShirtPhotoCommand,
    @GetUser() user: JWTToken
  ) {
    return await this.shirtPhoto.handle(command, user);
  } */

  @Put("/changepassword")
  @UseGuards(AuthGuard())
  @Roles("User")
  async ChangePasswordInApp(
    @Body() command: ChangePassInAppCommand,
    @GetUser() user: JWTToken
  ) {
    return await this.changePassword.handle(command, user);
  }

  @Delete("/remove")
  @UseGuards(AuthGuard())
  @Roles("User")
  async UpdateProfileCommand(
    @Body() command: RemoveProfileCommand,
    @GetUser() user: JWTToken
  ): Promise<RespDto> {
    return await this.remove.handle(command, user);
  }

  @Delete("/confirmremove")
  @UseGuards(AuthGuard())
  @Roles("User")
  async RemoveAccountInappCommand(@GetUser() user: JWTToken) {
    return;
  }

  @Post("/removeaccount")
  async RemoveAccountCommand(@Body() command: RemoveUserCommand) {
    return await this.removeUserByEmail.handle(command);
  }

  @Get("/logout")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("User", "Admin")
  async logout(@GetUser() user: JWTToken) {
    return await this.signOut.handle(user);
  }
}

// update profile photo and tshirt photo
/* @Put('/update/userphoto')
@UseGuards(AuthGuard())
@Roles('User')
@UseInterceptors(FilesInterceptor('photo', 1))
async UpdateUserPhoto(
  @Body() command: UpdateUserPhotosCommand,
  @UploadedFiles() photo: Express.Multer.File[],
  @GetUser() user: JWTToken,
): Promise<RespDto> {
  return await this.updateProfile.handle(photo, command, user);
}

@Put('/update/profilephoto')
@UseGuards(AuthGuard())
@Roles('User')
@UseInterceptors(FilesInterceptor('photo', 1))
async UpdateProfilePhoto(
  @Body() command: UpdateProfilePhotosCommand,
  @UploadedFiles() photo: Express.Multer.File[],
  @GetUser() user: JWTToken,
): Promise<RespDto> {
  return await this.updatePhoto.handle(photo, command, user);
} */
