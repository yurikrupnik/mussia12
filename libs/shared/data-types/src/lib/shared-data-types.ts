import type { providers, roles } from './shared-types';

export type User = {
  email: string;
  password: string;
  role: roles;
  image: string;
  firstName: string;
  lastName?: string;
  isActive?: boolean;
  creditCardNumber?: string;
  provider: providers;
};
