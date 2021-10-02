import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';

import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-item.dto';
import { User } from '@mussia12/shared/mongoose-schemas';
import { ValidationPipe } from '@mussia12/shared/validations';

@ApiTags('Users')
// @ApiCookieAuth()
// @ApiOAuth2(['users:write'])
// @ApiBearerAuth()
// @ApiBasicAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @ApiQuery({
  //   description: 'Limit of items to fetch',
  //   name: 'limit',
  //   required: false,
  //   example: 50,
  // })
  // @ApiQuery({
  //   description: 'A list of projections for mongodb queries',
  //   name: 'projection',
  //   required: false,
  //   isArray: true,
  //   enum: prjects,
  // })
  // @ApiQuery({
  //   description: 'page number',
  //   name: 'page',
  //   required: false,
  //   example: 1,
  //   allowEmptyValue: true,
  // })
  // @ApiQuery({
  //   description: 'stam tems',
  //   name: 'stam',
  //   required: false,
  //   explode: true,
  //   enum: prjects,
  // })
  @ApiOkResponse({
    description: 'The resources has been successfully returned',
    type: User,
    isArray: true,
  })
  getData(@Query('projection') projection: string | [string] | null) {
    return this.usersService.findAll({}, projection, {});
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The resources has been successfully returned',
    type: User,
  })
  findOne(@Query('projection') projection, @Param('id') id: string) {
    return this.usersService.findOne(id, projection);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The resources has been successfully updated',
    type: User,
  })
  update(
    @Body(new ValidationPipe()) body: UpdateUserDto,
    @Param('id') id: string
  ): Promise<User> {
    return this.usersService.update(id, body);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  post(
    @Body(new ValidationPipe()) createItemDto: CreateUserDto
  ): Promise<User> {
    return this.usersService.create(createItemDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The resources has been successfully deleted',
    type: String,
  })
  delete(@Param('id') id: string): Promise<string> {
    return this.usersService.delete(id);
  }
}
