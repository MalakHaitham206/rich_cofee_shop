// ============================================================
// order_service.ts — Feature: Orders
// Wraps the admin order endpoints on the Fastify backend:
//   GET  /admin/orders      — fetch all orders
//   PATCH /admin/orders/:id — update status
// ============================================================

import { apiClient } from '../../../core/lib/api_client';
import type { Order, OrderStatus } from '../../../core/types';

export class OrderService {
  /** GET /admin/orders — returns all orders, newest first */
  static async getOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>('/admin/orders');
  }

  /**
   * PATCH /admin/orders/:id
   * Body: { status: OrderStatus }
   * Returns: { message, order }
   */
  static async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const data = await apiClient.patch<{ message: string; order: Order }>(
      `/admin/orders/${id}`,
      { status },
    );
    return data.order;
  }
}
