import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService, type PaginatedUserDtos } from '../services/user.service';
import { JwtAuthGuard } from '../middleware/jwt.strategy';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../middleware/jwt.strategy';
import { MUNICIPALITY_ROLE } from '../constants/roles';
import { UpdateUserStatusDto, UserQueryDto } from '../dto/user.dto';
import { Types } from 'mongoose';

function validateObjectId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid user ID format');
  }
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    return this.userService.getCurrentUser(user.userId);
  }

  @Get(':id')
  async getUserById(
    @Param('id') id: string,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    validateObjectId(id);
    return this.userService.getUserById(id, currentUser);
  }

  @UseGuards(RolesGuard)
  @Roles(MUNICIPALITY_ROLE)
  @Get()
  async listUsers(@Query() query: UserQueryDto) {
    const result: PaginatedUserDtos = await this.userService.listUsers(query);
    return {
      success: true as const,
      message: 'Users retrieved successfully',
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @UseGuards(RolesGuard)
  @Roles(MUNICIPALITY_ROLE)
  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto
  ) {
    validateObjectId(id);
    return this.userService.updateUserStatus(id, dto);
  }
}
