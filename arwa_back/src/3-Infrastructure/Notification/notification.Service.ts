import { Inject, Injectable } from "@nestjs/common";
import { UserQuestionNotificationData } from "./nodification.models";
import { cert } from "firebase-admin/app";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { Logger } from "winston";

@Injectable()
export class NotificationService {
  fbClient: admin.messaging.Messaging;
  appTopic = "";
  constructor(
    private configSer: ConfigService,
    @Inject("Logger") private log: Logger
  ) {
    admin.initializeApp({
      credential: cert(JSON.parse(this.configSer.get("FIREBASE_ADMIN"))),
      projectId: this.configSer.get("FIREBASE_PROJECT_ID"),
    });
    this.fbClient = admin.messaging();
    this.appTopic = this.configSer.get("APP_TOPIC");
  }

  async AddUsertoMainTopic(fcmToken: string) {
    try {
      await this.fbClient.subscribeToTopic(fcmToken, this.appTopic);
      return true;
    } catch (error) {
      this.log.error("error in AddUsertoMainTopic", error);
      return false;
    }
  }

  async UpdateUsertoMainTopic(oldFCMToken: string, newFCMToken: string) {
    try {
      if (oldFCMToken)
        await this.fbClient.unsubscribeFromTopic(oldFCMToken, this.appTopic);
      if (newFCMToken)
        await this.fbClient.subscribeToTopic(newFCMToken, this.appTopic);
      return true;
    } catch (error) {
      this.log.error("error in UpdateUsertoMainTopic", error);
      return false;
    }
  }

  async RemoveUserFromMainTopic(removedFCMToken: string) {
    try {
      if (removedFCMToken) {
        const resp = await this.fbClient.unsubscribeFromTopic(
          removedFCMToken,
          this.appTopic
        );
        return !!resp;
      }
    } catch (error) {
      this.log.error("error in RemoveUserFromMainTopic", error);
      return false;
    }
  }

  async notifyApp(title: string, body: string) {
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      topic: this.appTopic,
    };

    try {
      const resp = await this.fbClient.send(message);
      return resp;
    } catch (error) {
      this.log.error("Error sending notifyApp:", error);
      return false;
    }
  }

  async notifyAllUsers(tokens: string[], title: string, body: string) {
    const message: admin.messaging.MulticastMessage = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    try {
      await this.fbClient.sendEachForMulticast(message);
      return true;
    } catch (error) {
      this.log.error("Error sending message:", error);
      return false;
    }
  }

  async notifyUser(token: string, title: string, body: string) {
    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      token,
    };

    try {
      await this.fbClient.send(message);
      return true;
    } catch (error) {
      this.log.error("Error sending message:", error);
      return false;
    }
  }

  async notifyUsersQuestionResults(users: UserQuestionNotificationData[]) {
    return 0;
  }
}
