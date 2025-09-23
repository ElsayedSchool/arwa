import { UserRepo } from "src/3-Infrastructure/Repositories";
import { Injectable } from "@nestjs/common";
import { JWTToken } from "src/3-Infrastructure/Authentication/AuthModels/token.model";
import { NotificationService } from "src/3-Infrastructure/Notification/notification.Service";

@Injectable()
export class SignOutHandler {
  constructor(private readonly authRepo: UserRepo) {}

  async handle(user: JWTToken) {
    const userData = await this.authRepo.getUserDetailById(user.id);
    userData.refreshToken = "";
    return await this.authRepo.saveAsync(userData);
  }
}
