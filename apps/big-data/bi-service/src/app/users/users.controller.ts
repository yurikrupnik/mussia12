import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateItemDto } from './dto/create-item.dto';
import { User } from '@mussia12/shared/data-types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getData() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() param): any {
    // return `id is ${param.id}`;
    const { id } = param;
    return this.usersService.findOne(id, []);
  }
  //
  // @Post()
  // create(@Body() createItemDto: Partial<User>) {
  //   console.log('createItemDto', createItemDto);
  //   return this.usersService.create(createItemDto, '');
  // }
}
