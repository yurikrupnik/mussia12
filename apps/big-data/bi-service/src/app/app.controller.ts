import {
  Body,
  Controller,
  // Get,
  // Param,
  Post,
  // HttpCode,
  // NotAcceptableException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  // ApiBadRequestResponse,
  // ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiProperty,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
  ApiBodyOptions,
  ApiTags,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationPipe } from './utils/validation.pipe';
import { AppService } from './app.service';
// import { ValidationPipe } from './utils/validation.pipe';
// import { UpdateUserDto } from './users/dto/create-item.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { events } from '@mussia12/shared/data-types';

class Error {
  @ApiProperty({
    description: `Not Acceptable error message`,
    example: 'Resource not found',
  })
  message: string;

  @ApiProperty({
    description: `Not Acceptable status`,
    example: 406,
  })
  private statusCode: number;

  @ApiProperty({
    description: `Not Acceptable error type`,
    example: 'Not Acceptable',
  })
  private error: string;
}

import { Event1, Event2, Event3 } from '@mussia12/shared/mongoose-schemas';

class Event1Dto {
  @ApiProperty({
    default: 'event1',
    // enum: Events,
    // enumName: 'event1'
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
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  ): Promise<[string]> {
    const { topic } = body;
    delete body.topic;
    console.log('topic', topic);
    return this.appService.publishTopic(topic, body);
  }
}
