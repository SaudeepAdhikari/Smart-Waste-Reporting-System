import { apiClient } from './client';
import { setToken } from '@/lib/auth-store';
import type { AuthResponse, AuthUser, LoginCredentials, RegisterData } from '@/types/auth';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiClient.post<AuthResponse>('/api/v1/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    if (data.token) {
      setToken(data.token);
    }
    return data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/register', {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (response.token) {
      setToken(response.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      setToken(null);
    }
  }

  async getCurrentUser(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/api/v1/auth/me');
  }
}

export const authService = new AuthService();
