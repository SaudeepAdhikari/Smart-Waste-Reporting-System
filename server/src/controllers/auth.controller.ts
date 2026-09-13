import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { JwtAuthGuard } from '../middleware/jwt.strategy';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../middleware/jwt.strategy';
import { MUNICIPALITY_ROLE } from '../constants/roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    await this.authService.logout();
    return null;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(MUNICIPALITY_ROLE)
  @Get('municipality-only')
  async municipalityOnly(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: `Hello ${user.email}. You have access to this municipality endpoint.`,
      role: user.role,
    };
  }
}