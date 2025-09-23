import { UserRole } from 'src/2-Domain';

export class JWTToken {
  constructor(
    public id: string,
    public name: string,
    public isActive: boolean,
    public roles: UserRole[] = [],
  ) {}
}
