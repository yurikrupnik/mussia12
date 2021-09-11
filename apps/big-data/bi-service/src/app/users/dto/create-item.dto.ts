// import { UserRoles } from '@mussia12/shared/data-types';
import { User } from '@mussia12/shared/mongoose-schemas';

// todo check and add to logic coz it is needed
export class CreateDto extends User {
  // readonly name: string;
  // readonly image?: string;
  // readonly lastName?: string;
  // readonly firstName?: string;
  // readonly email: string;
  // readonly password?: string;
  // readonly role?: UserRoles;
  // readonly isActive?: boolean;
}

export class UpdateDto {
  readonly name?: string;
}
