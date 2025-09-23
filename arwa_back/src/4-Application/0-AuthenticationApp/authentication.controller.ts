import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignUpCommand } from './Commands/SignUpCommand/signUp.Command';
import { SignInCommand } from './Commands/SignInCommand/signIn.Command';
import { SignUpHandler } from './Commands/SignUpCommand/signUp.Handler';
import { SignInHandler } from './Commands/SignInCommand/signIn.Handler';
import { GoogleSignInHandler } from './Commands/GoogleSignInCommand/googleSignIn.Handler';
import { FacebookSignInHandler } from './Commands/FacebookSignInCommand/facebookSignIn.Handler';
import { AppleSignInHandler } from './Commands/AppleSignInCommand/appleSignIn.Handler';
import { GoogleSignInCommand } from './Commands/GoogleSignInCommand/googleSignIn.Command';
import { FacebookSignInCommand } from './Commands/FacebookSignInCommand/facebookSignIn.Command';
import { AppleSignInCommand } from './Commands/AppleSignInCommand/appleSignIn.Command';
import { VisitorSignInCommand } from './Commands/VisitorSignInCommand/visitorSignIn.Command';
import { VisitorSignInHandler } from './Commands/VisitorSignInCommand/visitorSignIn.Handler';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenHandler } from './Commands/RefreshTokenCommand/refreshToken.handler';
import { RefreshTokenCommand } from './Commands/RefreshTokenCommand/refreshToken.Command';
import { VerifyEmailCommand } from './Commands/VerifyEmailCommand/verifyEmail.Command';
import { VerifyEmailHandler } from './Commands/VerifyEmailCommand/verifyEmail.Handler';
import { RevokeCodeHandler } from './Commands/RevokeCodeCommand/revokeCode.Handler';
import { RevokeCodeCommand } from './Commands/RevokeCodeCommand/revokeCode.Command';
import { ForgetPasswordHandler } from './Commands/ForgetPasswordCommand/forgetPassword.Handler';
import { ForgetPasswordCommand } from './Commands/ForgetPasswordCommand/forgetPassword.Command';
import { RoleGuard } from 'src/1-Core/Guards/Roles.Guard';
import { Roles } from 'src/3-Infrastructure/Authentication/Roles/Roles.Type';
import { ChangePasswordCommand } from './Commands/ChangePasswordCommand/changePassword.Command';
import { ChangePasswordHandler } from './Commands/ChangePasswordCommand/changePassword.Handler';
import { GetUser } from 'src/1-Core/Decorators/GetUser.Decorator';
import { JWTToken } from 'src/3-Infrastructure/Authentication/AuthModels/token.model';
import { SignOutHandler } from '../2-UserProfileApp/Commands/SignOutCommand/signOut.Handler';
import { FCMHandler } from './Commands/FCMCommand/signIn.Handler';

@Controller('authentication')
export class AuthenticationController {
  // all return jwt token and if firstlogin
  // unauthorized if it is not valid user

  constructor(
    private signUp: SignUpHandler,
    private signIn: SignInHandler,
    private google: GoogleSignInHandler,
    private facebook: FacebookSignInHandler,
    private apple: AppleSignInHandler,
    private visitor: VisitorSignInHandler,
    private refresh: RefreshTokenHandler,
    private verify: VerifyEmailHandler,
    private revokeCode: RevokeCodeHandler,
    private forgetPass: ForgetPasswordHandler,
    private changePass: ChangePasswordHandler,
    private fcmCommand: FCMHandler,
  ) {}

  @Get('/login/visitor')
  async visitorLogin(@Body() command: VisitorSignInCommand) {
    return await this.visitor.handle(command);
  }

  @Post('/signup/credential')
  async credentialSingUp(@Body() command: SignUpCommand) {
    return await this.signUp.handle(command);
  }

  @Post('/forgetpassword')
  async forgetPassword(@Body() command: ForgetPasswordCommand) {
    return await this.forgetPass.handle(command);
  }

  @Post('/changepassword')
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles('User', 'Admin')
  async changePassword(
    @Body() command: ChangePasswordCommand,
    @GetUser() user: JWTToken,
  ) {
    return await this.changePass.handle(command, user);
  }

  @Post('/login/credential')
  async credentialLogin(@Req() req: any, @Body() command: SignInCommand) {
    return await this.signIn.handle(command);
  }

  @Post('/login/google')
  async googleLogin(@Req() req: any, @Body() command: GoogleSignInCommand) {
    return await this.google.handle(command);
  }

  @Post('/signup/verifyemail')
  async verifyEmail(@Body() command: VerifyEmailCommand) {
    return await this.verify.handle(command);
  }

  @Post('/signup/resendcode')
  async RevokeCode(@Body() command: RevokeCodeCommand) {
    return await this.revokeCode.handle(command);
  }

  @Post('/login/facebook')
  async facebookLogin(@Body() command: FacebookSignInCommand) {
    return await this.facebook.handle(command);
  }
  /* 
  @Post('/login/twitter')
  async twitterLogin(@Body() command: TwitterSignInCommand) {
    return await this.twitter.handle(command);
  } */

  @Post('/login/apple')
  async appleLogin(@Body() command: AppleSignInCommand) {
    return await this.apple.handle(command);
  }

  @Post('/refreshToken')
  async refreshToken(@Body() command: RefreshTokenCommand) {
    return await this.refresh.handle(command);
  }

  @Post('/fcmtoken')
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles('User')
  async FCMToken(
    @Body() command: RefreshTokenCommand,
    @GetUser() user: JWTToken,
  ) {
    return await this.fcmCommand.handle(command, user);
  }
}

/* // google authentication
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    console.log(req.user);
    // handles the Google OAuth2 callback
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect('http://localhost:4200/login/succes/' + jwt);
    else res.redirect('http://localhost:4200/login/failure');
  } */
