import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { GetAllUsersHandler } from "./Queries/GetAllUser/getAllUsers.Handler";
import { GetUserDetailHandler } from "./Queries/GetUserDetail/getUserDetail.Handler";
import { DeactivateUserHandler } from "./Commands/DeactivateUser/deactivateUser.Handler";
import { ChangeUserRoleHandler } from "./Commands/ChangeUserRole/changeUserRole.Handler";
import { RemoveUserHandler } from "./Commands/RemoveUser/removeUser.Handler";
import { GetUserDetailQuery } from "./Queries/GetUserDetail/getUserDetail.Query";
import { DeactivateUserCommand } from "./Commands/DeactivateUser/deactivateUser.Command";
import { RemoveUserCommand } from "./Commands/RemoveUser/removeUser.Command";
import { ChangeUserRoleCommand } from "./Commands/ChangeUserRole/changeUserRole.Command";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/1-Core/Guards/Roles.Guard";
import { Roles } from "src/3-Infrastructure/Authentication/Roles/Roles.Type";
import { ChangePasswordHandler } from "./Commands/ChangePasswordCommand/changePassword.Handler";
import { UpsertUserCommand } from "./Commands/UpsertUser/upsertUser.Command";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UpsertUserHandler } from "./Commands/UpsertUser/upsertUser.Handler";

@Controller("user")
export class UserManagerController {
  constructor(
    private getAll: GetAllUsersHandler,
    private getDetail: GetUserDetailHandler,
    private upsertUser: UpsertUserHandler,
    private deactivate: DeactivateUserHandler,
    private changeRole: ChangeUserRoleHandler,
    private remove: RemoveUserHandler,
    private changePassword: ChangePasswordHandler
  ) {}

  @Get("/all")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async getAllUsers() {
    return await this.getAll.handle();
  }

  @Post("/detail")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async getUserDetail(@Body() query: GetUserDetailQuery) {
    return await this.getDetail.handle(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  @UseInterceptors(FilesInterceptor("photos", 1))
  async addUser(
    @Body() command: UpsertUserCommand,
    @UploadedFiles() photos: Express.Multer.File[]
  ) {
    return await this.upsertUser.handle(command, photos);
  }

  @Post("/deactive")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async deactivateUser(
    @Body() command: DeactivateUserCommand
  ): Promise<boolean> {
    return await this.deactivate.handle(command);
  }

  @Put("/remove")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async removeUser(@Body() command: RemoveUserCommand): Promise<boolean> {
    return await this.remove.handle(command);
  }

  @Post("/changerole")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async changeUserRole(
    @Body() command: ChangeUserRoleCommand
  ): Promise<boolean> {
    return await this.changeRole.handle(command);
  }

  //get user coins
  @Get("/getcoins")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin", "AddCoins")
  async getUserCoins(@Req() req) {
    const userId = req.user.id;
    console.log("userId", userId);
    return await this.getDetail.handle({ id: userId });
  }

  @Put("/changepassword")
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles("Admin")
  async changePasswordCommand(
    @Body() command: ChangeUserRoleCommand
  ): Promise<boolean> {
    return await this.changeRole.handle(command);
  }
}
