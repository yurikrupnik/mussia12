import { roles } from '@mussia12/shared/data-types';

export class CreateItemDto {
  readonly image?: string;
  readonly lastName?: string;
  readonly firstName?: string;
  readonly email: string;
  readonly password?: string;
  readonly role?: roles;
  readonly isActive?: boolean;
}
