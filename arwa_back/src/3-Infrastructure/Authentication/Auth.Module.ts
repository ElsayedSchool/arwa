import { Inject, Module } from '@nestjs/common';
import { BcryptService } from './Bcrypt/bycrypt.Service';
import { AppJWTService } from './JWT/JWT.Service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './AuthProviders/JWTStrategy.Service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStragey } from './AuthProviders/GoogleStrategy.Service';
import { FaceBookStragey } from './AuthProviders/FacebookStrategy.Service';
/* import { TwitterStragey } from './AuthProviders/TwitterStrategy.Service'; */
import { AppleStragey } from './AuthProviders/AppleStrategy.Service';
import { TokenValidator } from './Services/token-validator.Service';
import { VerifyGoogleIdToken } from './AuthTokens/google.verify-token';
import { VerifyFacebookIdToken } from './AuthTokens/facebook.verify-token';
import { HttpModule } from '@nestjs/axios';
import { winstonLoggerConfig } from '../Logger/logger.config';
import { VerifyAppleIdToken } from './AuthTokens/apple.verify-token';
import { TranslateService } from '../Translation/translation.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
    ConfigModule,
    HttpModule,
  ],
  providers: [
    {
      provide: 'Logger', // Provide a token or identifier for the logger
      useValue: winstonLoggerConfig, // Use the logger instance from your winstonLoggerConfig
    },
    BcryptService,
    TranslateService,
    AppJWTService,
    JwtStrategy,
    GoogleStragey,
    FaceBookStragey,
    AppleStragey,
    TokenValidator,
    VerifyGoogleIdToken,
    VerifyFacebookIdToken,
    VerifyAppleIdToken,
  ],
  exports: [
    BcryptService,
    AppJWTService,
    PassportModule,
    JwtStrategy,
    GoogleStragey,
    FaceBookStragey,
    AppleStragey,
    TokenValidator,
    VerifyGoogleIdToken,
    VerifyFacebookIdToken,
    VerifyAppleIdToken,
  ],
})
export class AuthModule {}
