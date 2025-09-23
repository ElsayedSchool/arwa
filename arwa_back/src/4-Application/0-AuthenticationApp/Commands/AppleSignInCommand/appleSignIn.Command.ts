import { Injectable } from '@nestjs/common';

@Injectable()
export class AppleSignInCommand {
  constructor(
    public IdentityToken: string,
    public UserIdentifier: string,
    public Email: string,
    public FamilyName: string,
    public GivenName: string,
    public fcmToken: string,
  ) {}
}
