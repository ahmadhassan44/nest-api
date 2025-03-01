import { Tokens } from './tokens.type';
import { UserData } from './user-data.type';

export interface AuthResponse {
  tokens: Tokens;
  user: UserData;
  meta: {
    issued: string;
    serverTime: string;
  };
} 