import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Event1Service } from './event1.service';
import { CreateEvent1Dto } from './dto/create-event1.dto';
import { UpdateEvent1Dto } from './dto/update-event1.dto';
import { CreateEvent2Dto } from '../event2/dto/create-event2.dto';
import { UpdateEvent2Dto } from '../event2/dto/update-event2.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Event1')
@Controller('event1')
export class Event1Controller {
  constructor(private readonly event1Service: Event1Service) {}

  @Post()
  create(@Body() createEvent2Dto: CreateEvent2Dto) {
    return this.event1Service.create(createEvent2Dto);
  }

  @Get()
  findAll() {
    return this.event1Service.findAll({}, [], {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.event1Service.findOne(id, []);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvent2Dto: UpdateEvent2Dto) {
    return this.event1Service.update(id, updateEvent2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.event1Service.remove(id);
  }
}
