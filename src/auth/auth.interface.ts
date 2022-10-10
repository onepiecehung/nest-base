import { UserRole } from '../users/entities/user.entity';

export enum ETokenType {
  access = 'ACCESS',
  refresh = 'REFRESH',
}

export interface IToken {
  userId: number;
  sessionId: number;
  role: UserRole;
  tokenType: ETokenType;
}

export interface IVerifyInfo {
  socialId: string;
  email: string;
}
