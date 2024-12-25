import type { RoleEnum } from '@/components/common/constants/RoleEnum';

export interface IRawJwtPayload {
  id: number;
  login: string;
  iss: string;
  exp: number;
  sub: string;
  authorities: [
    {
      authority: string;
    }
  ]
}

export interface IJwtPayload {
  exp: number;
  userId: number;
  userLogin: string;
  userRole: RoleEnum;
}
