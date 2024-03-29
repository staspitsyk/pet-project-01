import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Patch,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { Request as RequestType } from 'express';

import { USERS_ROUTE } from './routes';
import { CreateUserResponse } from './responses/create-user.response';
import { GetUserResponse } from './responses/get-user.response';
import { GetUserByEmailParams, GetUserByIdParams } from './dto/user-params.dto';
import { PatchUserDto } from './dto/update-user.dto';
import { UpdateUserResponse } from './responses/update-user.response';
import { DeleteUserResponse } from './responses/delete-user.response';
import { AuthGuard } from '../auth/auth.guard';
import { USER_AUTH_PAYLOAD_KEY } from 'src/constants/auth';
import { UserJwtPayload } from '../auth/types';

@ApiTags(USERS_ROUTE)
@Controller(USERS_ROUTE)
export class UsersPublicController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateUserResponse })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const id = await this.usersService.createUser(createUserDto);

    return new CreateUserResponse(id);
  }

  @Get('/email/:email')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({ name: 'email', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserResponse })
  async getUserByEmail(@Param() params: GetUserByEmailParams) {
    const user = await this.usersService.getUserByEmail(params.email);
    return new GetUserResponse(user);
  }

  @Get('/id/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserResponse })
  async getUserById(@Param() params: GetUserByIdParams) {
    const user = await this.usersService.getUserById(params.id);
    return new GetUserResponse(user);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'authorization', required: true })
  @ApiBody({ type: PatchUserDto })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateUserResponse })
  async updateUserById(@Request() req: RequestType, @Body() updateUserDto: PatchUserDto) {
    const { userId }: UserJwtPayload = req[USER_AUTH_PAYLOAD_KEY];
    await this.usersService.updateUserById(userId, updateUserDto);

    return new UpdateUserResponse();
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: DeleteUserResponse })
  async deleteUserById(@Request() req: RequestType) {
    const { userId }: UserJwtPayload = req[USER_AUTH_PAYLOAD_KEY];
    await this.usersService.deleteUserById(userId);

    return new DeleteUserResponse();
  }
}
