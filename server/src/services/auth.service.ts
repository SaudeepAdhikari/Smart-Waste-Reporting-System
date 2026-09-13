import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { hashPassword, comparePassword } from '../utils/password';
import type { AuthenticatedUser, JwtPayload } from '../middleware/jwt.strategy';
import { DEFAULT_ROLE, type UserRole } from '../constants/roles';

export interface AuthUserResponse {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthResponse {
  user: AuthUserResponse;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    const role: UserRole = DEFAULT_ROLE;

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      role,
    });

    return this.buildAuthResponse(
      user._id.toString(),
      user.email,
      user.fullName,
      user.phone,
      user.role,
      user.isActive
    );
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const passwordValid = await comparePassword(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.buildAuthResponse(
      user._id.toString(),
      user.email,
      user.fullName,
      user.phone,
      user.role,
      user.isActive
    );
  }

  async me(userId: string): Promise<AuthUserResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async logout(): Promise<void> {
    // Stateless JWT: nothing to do server-side.
    // Client is expected to discard the token.
    return;
  }

  private buildAuthResponse(
    userId: string,
    email: string,
    fullName: string,
    phone: string,
    role: UserRole,
    isActive: boolean
  ): AuthResponse {
    const payload: JwtPayload = { sub: userId, email, role };
    const token = this.jwtService.sign(payload);
    return {
      user: { id: userId, email, fullName, phone, role, isActive },
      token,
    };
  }

  verifyToken(token: string): AuthenticatedUser | null {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      return { userId: payload.sub, email: payload.email, role: payload.role };
    } catch {
      return null;
    }
  }
}