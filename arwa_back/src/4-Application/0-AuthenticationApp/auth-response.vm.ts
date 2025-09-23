export class authResponseVm {
  constructor(
    public token: string,
    public refreshToken: string,
    public isProfileInit: boolean,
    public isEmailVerified: boolean,
  ) {}
}
