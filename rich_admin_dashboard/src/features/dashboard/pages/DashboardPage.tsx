// ============================================================
// DashboardPage.tsx — Feature: Dashboard
// Shows 4 KPI stat cards + recent orders table.
// Data comes from DashboardService which calls /admin/orders.
//
// Design: same card/shadow style as mobile ProductCard —
// white cards on #F9F9F9 background.
// ============================================================

import { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { StatsCard }        from '../../../core/components/StatsCard';
import { OrderStatusBadge } from '../../../core/components/OrderStatusBadge';
import { LoadingSpinner }   from '../../../core/components/LoadingSpinner';
import { DashboardService } from '../api_services/dashboard_service';
import { useAuth }          from '../../../core/context/AuthContext';
import type { DashboardStats, Order } from '../../../core/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats,        setStats]        = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, orders] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getRecentOrders(),
        ]);
        setStats(s);
        setRecentOrders(orders);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-[1200px] mx-auto animate-[fadeIn_0.3s_ease]">

      {/* Page header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-text-main mb-1">Dashboard</h1>
          <p className="text-sm text-text-muted">Welcome back, {user?.name} 👋</p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 mb-8">
        <StatsCard
          label="Orders Today"
          value={stats?.ordersToday ?? 0}
          icon={ShoppingBag}
          color="#C67C4E"
          bgColor="#EAD6C8"
        />
        <StatsCard
          label="Total Revenue"
          value={`EGP ${stats?.totalRevenue.toFixed(2) ?? '0.00'}`}
          icon={TrendingUp}
          color="#10B981"
          bgColor="#D1FAE5"
        />
        <StatsCard
          label="Pending Orders"
          value={stats?.pendingOrders ?? 0}
          icon={Clock}
          color="#F59E0B"
          bgColor="#FEF3C7"
        />
        <StatsCard
          label="Active Products"
          value={stats?.activeProducts ?? 0}
          icon={CheckCircle}
          color="#3B82F6"
          bgColor="#DBEAFE"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 px-6 border-b border-[#F1F5F9]">
          <h2 className="text-lg font-semibold text-text-main">Recent Orders</h2>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">Order ID</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">Customer</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">Items</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">Total</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">Status</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle font-mono text-text-muted">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">{order.profiles?.name ?? 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">{order.order_items?.length ?? 0} item(s)</td>
                  <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">EGP {Number(order.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-text-muted p-12">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
