import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export class HomeService {
  static async fetchCategories() {
    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message || 'Failed to fetch categories');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred fetching categories');
    }
  }

  static async fetchProducts(categoryId?: string, search?: string) {
    try {
      // Build query string manually for React Native (URLSearchParams is sometimes limited without polyfill, but usually fine. For safety we can build it directly).
      let queryString = '';
      if (categoryId || search) {
        const params = [];
        if (categoryId) params.push(`category_id=${encodeURIComponent(categoryId)}`);
        if (search) params.push(`search=${encodeURIComponent(search)}`);
        queryString = `?${params.join('&')}`;
      }

      const url = `${BASE_URL}/products${queryString}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred fetching products');
    }
  }
  
 
}
