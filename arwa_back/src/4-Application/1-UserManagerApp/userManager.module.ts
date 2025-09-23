import { Module } from "@nestjs/common";
import { winstonLoggerConfig } from "src/3-Infrastructure/Logger/logger.config";
import { UserManagerController } from "./userManager.controller";
import { InfrastructureModule } from "src/3-Infrastructure/Infrastructure.Module";
import { ChangePasswordHandler } from "./Commands/ChangePasswordCommand/changePassword.Handler";
import { GetAllUsersHandler } from "./Queries/GetAllUser/getAllUsers.Handler";
import { ChangeUserRoleHandler } from "./Commands/ChangeUserRole/changeUserRole.Handler";
import { DeactivateUserHandler } from "./Commands/DeactivateUser/deactivateUser.Handler";
import { RemoveUserHandler } from "./Commands/RemoveUser/removeUser.Handler";
import { GetUserDetailHandler } from "./Queries/GetUserDetail/getUserDetail.Handler";
import { AuthService } from "../0-AuthenticationApp/auth.service";
import { UpsertUserHandler } from "./Commands/UpsertUser/upsertUser.Handler";

@Module({
  imports: [InfrastructureModule],
  providers: [
    {
      provide: "Logger", // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
    AuthService,
    ChangePasswordHandler,
    GetAllUsersHandler,
    ChangeUserRoleHandler,
    UpsertUserHandler,
    DeactivateUserHandler,
    RemoveUserHandler,
    GetUserDetailHandler,
  ],
  controllers: [UserManagerController],
  exports: [],
})
export class UserManagerModule {}
