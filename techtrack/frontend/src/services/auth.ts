import api from './api';
import { User, RegisterData } from '../types';

// Auth service
const authService = {
  // Login user
  async login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData);
    return response.data;
  },

  // Register user
  async register(userData: RegisterData): Promise<User> {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<User> {
    const response = await api.put('/users/me', {
      password: newPassword,
    });
    return response.data;
  },
};

export default authService;