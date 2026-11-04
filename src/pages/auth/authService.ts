import api from '../../services/api';
import { LoginCredentials, RegisterData, AuthResponse, ForgotPasswordData, ResetPasswordData } from './auth.types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return {
      user: {
        id: response.data._id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role,
        createdAt: response.data.createdAt || new Date().toISOString(),
      },
      token: response.data.token,
      expiresIn: 86400,
    };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return {
      user: {
        id: response.data._id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role,
        createdAt: response.data.createdAt || new Date().toISOString(),
      },
      token: response.data.token,
      expiresIn: 86400,
    };
  },

  logout: async (): Promise<void> => {
    return Promise.resolve();
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};