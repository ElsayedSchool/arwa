import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTToken } from '../AuthModels/token.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppJWTService {
  constructor(private JWTSer: JwtService, private configSer: ConfigService) {}

  async getJwtToken(payload: JWTToken): Promise<string> {
    return await this.JWTSer.signAsync(
      {
        ...payload,
        exp: Math.floor(Date.now() / 1000) * 60 * 60 * 3,
      },
      { secret: this.configSer.get('JWT_SECRET') },
    );
  }

  async getRefreshToken(payload: any): Promise<string> {
    return await this.JWTSer.signAsync(
      { ...payload, exp: Math.floor(Date.now() / 1000) * 60 * 60 * 24 * 30 },
      {
        secret: this.configSer.get('REFRESH_JWT_SECRET'),
      },
    );
  }

  async getToken(payload: any, expirationTimeInMinutes: number) {
    return await this.JWTSer.signAsync({
      ...payload,
      exp: Math.floor(Date.now() / 1000) * 60 * expirationTimeInMinutes,
    });
  }

  async VerifyRefreshToken(refreshToken: string) {
    return await this.JWTSer.verifyAsync(refreshToken, {
      secret: this.configSer.get('REFRESH_JWT_SECRET'),
      maxAge: '60d',
    });
  }
}
