import { env } from '@/config/env';
import { LoginCredentials, AuthResponse, User } from '@/types/auth';

const API_URL = env.VITE_APP_BASE_URL
// Mock authentication - replace with real API calls
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: credentials.email, password: credentials.password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    // The backend returns { token }, so we need to decode or fetch user info
    // For now, just store the token and a minimal user object
    const token = data.token;
    const user: User = {
      id: '', // You may want to decode the JWT to get the user id
      email: credentials.email,
      name: '', // Backend does not provide name, so leave blank or fetch from /me endpoint if available
    };
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  }
};
