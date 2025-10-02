// Interfaces
import { AdminInterface } from './admins';
import { GeneralResponseInterface } from './general';

export interface LoginRequestInterface {
  login: string;
  password: string;
}

export interface LoginResponseInterface extends GeneralResponseInterface {
  sessionToken?: string;
}

export interface MeResponseInterface extends GeneralResponseInterface {
  user?: AdminInterface;
}