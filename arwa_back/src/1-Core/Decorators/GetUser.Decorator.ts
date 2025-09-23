import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/2-Domain';
import { DeepPartial } from 'typeorm';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): DeepPartial<User> => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
