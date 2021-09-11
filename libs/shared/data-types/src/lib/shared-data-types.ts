import type { LoginProviders, UserRoles } from './shared-types';

export type User = {
  email: string;
  password: string;
  role: UserRoles;
  image: string;
  firstName: string;
  lastName?: string;
  isActive?: boolean;
  creditCardNumber?: string;
  provider: LoginProviders;
};

export type Project = {
  name: string;
  description: string;
  userId: string;
};
