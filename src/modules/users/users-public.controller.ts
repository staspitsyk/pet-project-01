import { Controller, Get, Post, Body, Param, HttpStatus, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { Request as RequestType } from 'express';

import { USERS_ROUTE } from './routes';
import { CreateUserResponse } from './responses/create-user.response';
import { GetUserResponse } from './responses/get-user.response';
import { GetUserByEmailParams, GetUserByIdParams } from './dto/user-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  @ApiParam({ name: 'email', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserResponse })
  getUserByEmail(@Param() params: GetUserByEmailParams) {
    return this.usersService.getUserByEmail(params.email);
  }

  @Get('/id/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: GetUserResponse })
  getUserById(@Param() params: GetUserByIdParams) {
    return this.usersService.getUserById(params.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiHeader({ name: 'authorization', required: true })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.OK, type: UpdateUserResponse })
  async updateUserById(@Request() req: RequestType, @Body() updateUserDto: UpdateUserDto) {
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
