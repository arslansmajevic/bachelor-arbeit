export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserInformationDto {
  firstName: string;
  lastName: string;
  isBlocked: boolean;
  isPending: boolean;
  email: string;
}

export interface UserSearchDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  isLocked?: boolean;
  isPending?: boolean;
  pageIndex: number;
  pageSize: number;
}
