import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  // Query,
  Param,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
// import { CreateItemDto } from './dto/create-item.dto';
// import { User } from '../schemas/user';
import { User } from '@mussia12/shared/mongoose-schemas';
// import { User } from '@mussia12/shared/data-types';

// const obj: User = {
//   name: 'as',
//   email: '12@sa.com',
//   password: '23123',
//   _id: '2',
// };

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getData(
    @Query('projection') projection: string | [string] | null,
    @Query('limit') limit: string,
    @Query('page') page: string
  ) {
    const skip = Number(limit) * Number(page) || Number(limit);
    return this.usersService.findAll({}, projection, {
      limit: Number(limit),
      skip: Number(skip),
    });
  }

  @Get(':id')
  findOne(@Query('projection') projection, @Param('id') id: string) {
    return this.usersService.findOne(id, projection);
  }

  @Put(':id')
  update(@Body() body: User, @Param('id') id): Promise<User> {
    console.log('createItemDto', body);
    // return createItemDto;
    console.log(body);
    console.log(id);
    // return 'as';
    return this.usersService.update(id, body);
  }

  @Post()
  post(@Body() createItemDto: User): Promise<User> {
    console.log('createItemDto', createItemDto);
    return this.usersService.create(createItemDto);
  }

  @Delete(':id')
  delete(@Param('id') id): Promise<string> {
    return this.usersService.delete(id);
  }
}
