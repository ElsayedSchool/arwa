import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { SignUpHandler } from './Commands/SignUpCommand/signUp.Handler';
import { SignInHandler } from './Commands/SignInCommand/signIn.Handler';
import { InfrastructureModule } from 'src/3-Infrastructure/Infrastructure.Module';
import { GoogleSignInHandler } from './Commands/GoogleSignInCommand/googleSignIn.Handler';
import { FacebookSignInHandler } from './Commands/FacebookSignInCommand/facebookSignIn.Handler';
import { AppleSignInHandler } from './Commands/AppleSignInCommand/appleSignIn.Handler';
import { AuthService } from './auth.service';
import { VisitorSignInHandler } from './Commands/VisitorSignInCommand/visitorSignIn.Handler';
import { RefreshTokenHandler } from './Commands/RefreshTokenCommand/refreshToken.handler';
import { VerifyEmailHandler } from './Commands/VerifyEmailCommand/verifyEmail.Handler';
import { RevokeCodeHandler } from './Commands/RevokeCodeCommand/revokeCode.Handler';
import { ForgetPasswordHandler } from './Commands/ForgetPasswordCommand/forgetPassword.Handler';
import { ChangePasswordHandler } from './Commands/ChangePasswordCommand/changePassword.Handler';
import { FCMHandler } from './Commands/FCMCommand/signIn.Handler';

@Module({
  imports: [InfrastructureModule],
  providers: [
    SignUpHandler,
    SignInHandler,
    GoogleSignInHandler,
    FacebookSignInHandler,
    AppleSignInHandler,
    AuthService,
    VisitorSignInHandler,
    RefreshTokenHandler,
    VerifyEmailHandler,
    RevokeCodeHandler,
    ForgetPasswordHandler,
    ChangePasswordHandler,
    FCMHandler,
  ],
  controllers: [AuthenticationController],
  exports: [],
})
export class AuthenticationModule {}
