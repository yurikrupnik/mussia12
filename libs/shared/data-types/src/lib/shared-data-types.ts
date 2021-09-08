import type { providers } from './shared-types';

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  provider: providers;
};
