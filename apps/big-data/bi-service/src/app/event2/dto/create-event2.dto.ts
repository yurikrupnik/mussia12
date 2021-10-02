import { OmitType } from '@nestjs/swagger';
import { Event2 } from '@mussia12/shared/mongoose-schemas';

export class CreateEvent2Dto extends OmitType(Event2, ['_id'] as const) {}
