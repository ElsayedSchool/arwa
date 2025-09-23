import { AuthProvider } from 'src/2-Domain';

export class UserData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  photo: string;
  email: string;
  provider: AuthProvider;
  fcmToken: string;
}
