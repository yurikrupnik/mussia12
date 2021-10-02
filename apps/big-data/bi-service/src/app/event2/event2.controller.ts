import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Event2Service } from './event2.service';
import { CreateEvent2Dto } from './dto/create-event2.dto';
import { UpdateEvent2Dto } from './dto/update-event2.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Event2')
@Controller('event2')
export class Event2Controller {
  constructor(private readonly event2Service: Event2Service) {}

  @Post()
  create(@Body() createEvent2Dto: CreateEvent2Dto) {
    return this.event2Service.create(createEvent2Dto);
  }

  @Get()
  findAll() {
    return this.event2Service.findAll({}, [], {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.event2Service.findOne(id, []);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvent2Dto: UpdateEvent2Dto) {
    return this.event2Service.update(id, updateEvent2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.event2Service.remove(id);
  }
}
