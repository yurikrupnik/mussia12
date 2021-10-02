import { PartialType } from '@nestjs/mapped-types';
import { CreateBiDto } from './create-bi.dto';

export class UpdateBiDto extends PartialType(CreateBiDto) {}
