// ============================================================
// product_service.ts — Feature: Products
// Full CRUD for the admin products endpoints:
//   GET    /admin/products          — all products
//   POST   /admin/products          — create
//   PATCH  /admin/products/:id      — update
//   PATCH  /admin/products/:id/toggle — toggle active
//   DELETE /admin/products/:id      — delete
//   GET    /categories              — for the category dropdown
// ============================================================

import { apiClient } from '../../../core/lib/api_client';
import type { Product, Category, CreateProductPayload } from '../../../core/types';

export class ProductService {
  /** GET /admin/products — all products including inactive */
  static async getProducts(): Promise<Product[]> {
    return apiClient.get<Product[]>('/admin/products');
  }

  /** GET /categories — for the Add/Edit product dropdown */
  static async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  }

  /**
   * POST /admin/products
   * Body: { name, description?, price, image_url?, category_id }
   */
  static async createProduct(payload: CreateProductPayload): Promise<Product> {
    const data = await apiClient.post<{ product: Product }>('/admin/products', payload);
    return data.product;
  }

  /**
   * PATCH /admin/products/:id
   * Body: partial product fields
   */
  static async updateProduct(id: string, payload: Partial<CreateProductPayload>): Promise<Product> {
    const data = await apiClient.patch<{ product: Product }>(`/admin/products/${id}`, payload);
    return data.product;
  }

  /**
   * PATCH /admin/products/:id/toggle
   * Flips is_active on the backend, returns { is_active }
   */
  static async toggleActive(id: string): Promise<boolean> {
    const data = await apiClient.patch<{ is_active: boolean }>(`/admin/products/${id}/toggle`, {});
    return data.is_active;
  }

  /** DELETE /admin/products/:id */
  static async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/admin/products/${id}`);
  }
}
