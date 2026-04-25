import { Platform } from 'react-native';
import { AuthService } from '../../auth/api_services/auth_service';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export class OrderService {
  static async placeOrder(items: { product_id: string, quantity: number }[]) {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('You must be logged in to place an order.');
      }

      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(data.message || 'Failed to place order.');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred while placing the order.');
    }
  }
  static async getOrders() {
    try {
      const token = await AuthService.getToken();
      if (!token) {
        throw new Error('You must be logged in to view orders.');
      }

      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message || 'Failed to fetch orders.');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred while fetching orders.');
    }
  }
}
