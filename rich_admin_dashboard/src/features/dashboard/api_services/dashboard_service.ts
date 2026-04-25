// ============================================================
// dashboard_service.ts — Feature: Dashboard
// Derives KPI stats from all orders fetched via the Fastify
// admin API. No separate /stats endpoint exists, so we
// compute them client-side from the orders array.
// ============================================================

import { apiClient } from '../../../core/lib/api_client';
import type { Order, Product, DashboardStats } from '../../../core/types';

export class DashboardService {
  /**
   * Fetch all orders and products then compute KPI stats.
   */
  static async getStats(): Promise<DashboardStats> {
    const [orders, products] = await Promise.all([
      apiClient.get<Order[]>('/admin/orders'),
      apiClient.get<Product[]>('/products')
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const ordersToday = orders.filter(o => new Date(o.created_at) >= todayStart).length;
    const activeProducts = products.filter(p => p.is_active).length;

    return {
      totalOrders:     orders.length,
      ordersToday:     ordersToday,
      totalRevenue:    orders.reduce((s, o) => s + Number(o.total_amount), 0),
      pendingOrders:   orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      activeProducts:  activeProducts,
    };
  }

  /**
   * Return the 6 most recent orders for the dashboard preview table.
   * The backend already returns them newest-first.
   */
  static async getRecentOrders(): Promise<Order[]> {
    const orders = await apiClient.get<Order[]>('/admin/orders');
    return orders.slice(0, 6);
  }
}
