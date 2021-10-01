import { PartialType } from '@nestjs/mapped-types';
import { CreateEvent2Dto } from './create-event2.dto';

export class UpdateEvent2Dto extends PartialType(CreateEvent2Dto) {}
