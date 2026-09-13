import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository, type PaginatedUsers } from '../repositories/user.repository';
import type { UserDocument } from '../models';
import type { UserRole } from '../constants/roles';
import { CITIZEN_ROLE, COLLECTOR_ROLE } from '../constants/roles';
import type { AuthenticatedUser } from '../middleware/jwt.strategy';
import type { UpdateUserStatusDto, UserQueryDto } from '../dto/user.dto';

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toUserDto(doc: UserDocument): UserDto {
  return {
    id: doc._id.toString(),
    fullName: doc.fullName,
    email: doc.email,
    phone: doc.phone,
    role: doc.role,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export interface PaginatedUserDtos {
  items: UserDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getCurrentUser(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return toUserDto(user);
  }

  async getUserById(id: string, currentUser: AuthenticatedUser): Promise<UserDto> {
    if (currentUser.role === CITIZEN_ROLE || currentUser.role === COLLECTOR_ROLE) {
      if (id !== currentUser.userId) {
        throw new ForbiddenException('You are not authorized to access this user');
      }
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return toUserDto(user);
  }

  async listUsers(query: UserQueryDto): Promise<PaginatedUserDtos> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const result: PaginatedUsers = await this.userRepository.findMany(
      {
        role: query.role,
        isActive: query.isActive,
      },
      { page, limit }
    );

    return {
      items: result.items.map((item) => toUserDto(item)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto): Promise<UserDto> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.userRepository.updateActiveStatus(id, dto.isActive);
    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return toUserDto(updated);
  }
}
