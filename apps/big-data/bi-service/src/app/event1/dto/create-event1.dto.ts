import { OmitType } from '@nestjs/swagger';
import { Event1 } from '@mussia12/shared/mongoose-schemas';

export class CreateEvent1Dto extends OmitType(Event1, ['_id'] as const) {}
