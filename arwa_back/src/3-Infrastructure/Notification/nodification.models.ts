export class UserQuestionNotificationData {
  constructor(
    public username: string,
    public fcmToken: string,
    public prizePoints: number,
  ) {}
}
