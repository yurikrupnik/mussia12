import { PartialType } from '@nestjs/swagger';
import { User } from '@mussia12/shared/mongoose-schemas';

export class CreateUserDto extends User {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
