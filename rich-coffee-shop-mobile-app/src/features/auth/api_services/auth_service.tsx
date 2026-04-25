import { Platform } from 'react-native';

import * as SecureStore from 'expo-secure-store';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export class AuthService {

  static async login(email: string, password: string) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message || 'Login failed');
      }
   
      // Save token and user profile securely
      await SecureStore.setItemAsync(TOKEN_KEY, data.token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  static async register(name: string, email: string, password: string) {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  static async getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }

  static async getUserProfile() {
    const userStr = await SecureStore.getItemAsync(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  static async logout() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    
  }
}

