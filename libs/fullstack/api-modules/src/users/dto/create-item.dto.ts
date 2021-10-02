import { PartialType, OmitType } from '@nestjs/swagger';
import { User } from '@mussia12/shared/mongoose-schemas';

export class CreateUserDto extends OmitType(User, ['_id'] as const) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
