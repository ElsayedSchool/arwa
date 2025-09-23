import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTToken } from '../AuthModels/token.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configSer: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configSer.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<JWTToken> {
    if (!payload.isActive)
      throw new UnauthorizedException(
        'تم ايقاف تفعيل الحساب من فضلك تواصل مع اداره الموقع لمزيد من التفاصيل',
      );
    return {
      name: payload.name,
      id: payload.id,
      roles: payload.roles || [],
      isActive: payload.isActive,
    };
  }
}
