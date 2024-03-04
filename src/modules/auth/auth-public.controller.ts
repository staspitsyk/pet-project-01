import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AUTH_ROUTE } from './routes';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './responses/login.response';

@ApiTags(AUTH_ROUTE)
@Controller(AUTH_ROUTE)
export class AuthPublicController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponse })
  @ApiBody({ type: LoginDto })
  async createUser(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
