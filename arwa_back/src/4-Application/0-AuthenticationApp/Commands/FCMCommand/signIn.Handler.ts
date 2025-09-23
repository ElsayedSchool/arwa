import { Injectable } from '@nestjs/common';
import { FCMCommand } from './fcm.Command';
import { ProfileRepo } from 'src/3-Infrastructure/Repositories';
import { JWTToken } from 'src/3-Infrastructure/Authentication/AuthModels/token.model';
import { NotificationService } from 'src/3-Infrastructure/Notification/notification.Service';

@Injectable()
export class FCMHandler {
  constructor(
    private readonly profileRepo: ProfileRepo,
    private notiSer: NotificationService,
  ) {}

  async handle(command: FCMCommand, user: JWTToken) {
    // get user by user data
    const userData = await this.profileRepo.findByIdAsync(user.id);

    // update fcm
    if (userData.fcmToken != command.fcmToken) {
      await this.notiSer.UpdateUsertoMainTopic(
        userData.fcmToken,
        command.fcmToken,
      );
      userData.fcmToken = command.fcmToken;
      await this.profileRepo.saveAsync(userData);
    }

    // save data
    return true;
  }
}
