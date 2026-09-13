import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ALL_ROLES, type UserRole } from '../constants/roles';

export class UpdateUserStatusDto {
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive!: boolean;
}

export class UserQueryDto {
  @IsOptional()
  @IsIn([...ALL_ROLES], { message: `role must be one of: ${ALL_ROLES.join(', ')}` })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsOptional()
  @IsInt({ message: 'page must be a positive integer' })
  @Min(1, { message: 'page must be at least 1' })
  page?: number;

  @IsOptional()
  @IsInt({ message: 'limit must be a positive integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit cannot exceed 100' })
  limit?: number;
}
