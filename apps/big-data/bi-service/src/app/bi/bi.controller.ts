import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { BiService } from './bi.service';
import { CreateBiDto } from './dto/create-bi.dto';
import { UpdateBiDto } from './dto/update-bi.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotAcceptableResponse,
  ApiTags,
  ApiProperty,
  getSchemaPath,
  ApiBodyOptions,
} from '@nestjs/swagger';
import { ValidationPipe } from '../utils/validation.pipe';
import { Event1, Event2, Event3 } from '@mussia12/shared/mongoose-schemas';
import { events } from '@mussia12/shared/data-types';

class Event1Dto {
  @ApiProperty({
    default: 'event1',
  })
  topic: events;

  @ValidateNested({ each: true })
  @Type(() => Event1)
  @ApiProperty({})
  message: Event1;
}

class Event2Dto {
  @ApiProperty({
    default: 'event2',
  })
  topic: events;

  @ApiProperty({})
  message: Event2;
}

class Event3Dto {
  @ApiProperty({
    default: 'event3',
  })
  topic: events;

  @ApiProperty({})
  message: Event3;
}

type EventsBodies = Event1Dto | Event2Dto | Event3Dto;

const bodySchema: ApiBodyOptions = {
  // type: 'object',
  schema: {
    oneOf: [
      {
        $ref: getSchemaPath(Event1Dto),
      },
      {
        $ref: getSchemaPath(Event2Dto),
      },
      {
        type: getSchemaPath(Event3Dto),
      },
      // { type: getSchemaPath(Event4) },
    ],
  },
};

@Controller('bi')
@ApiTags('BI')
@ApiExtraModels(Event1Dto)
@ApiExtraModels(Event2Dto)
@ApiExtraModels(Event3Dto)
export class BiController {
  constructor(private readonly biService: BiService) {}

  @Post('publish-topic')
  @ApiCreatedResponse({
    description: 'The topic has been successfully sent message',
    type: String,
  })
  @ApiNotAcceptableResponse({
    description: 'Topic name is not defined in the cloud',
    type: Error,
  })
  @ApiBody(bodySchema)
  publishTopic(
    @Body(new ValidationPipe()) body: EventsBodies
  ): Promise<string> {
    const { topic } = body;
    delete body.topic;
    console.log('topic', topic);
    return this.biService.publishTopic(topic, body);
  }
}
