import type { LoginCredentials, RegisterData, AuthResponse, AuthUser } from '@/types/auth';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Connect to POST /api/v1/auth/login when backend is ready
    // Parameter will be used when backend integration is implemented
    void credentials;
    throw new Error('Authentication service not connected to backend yet');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // TODO: Connect to POST /api/v1/auth/register when backend is ready
    // Parameter will be used when backend integration is implemented
    void data;
    throw new Error('Authentication service not connected to backend yet');
  }

  async logout(): Promise<void> {
    // TODO: Connect to POST /api/v1/auth/logout when backend is ready
    throw new Error('Authentication service not connected to backend yet');
  }

  async getCurrentUser(): Promise<AuthUser> {
    // TODO: Connect to GET /api/v1/auth/me when backend is ready
    throw new Error('Authentication service not connected to backend yet');
  }
}

export const authService = new AuthService();
