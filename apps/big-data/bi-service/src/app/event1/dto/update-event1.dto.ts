import { PartialType } from '@nestjs/mapped-types';
import { CreateEvent1Dto } from './create-event1.dto';

export class UpdateEvent1Dto extends PartialType(CreateEvent1Dto) {}
