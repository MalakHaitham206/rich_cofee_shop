// ============================================================
// OrdersPage.tsx — Feature: Orders
// Full orders management with:
//   1. Initial fetch from GET /admin/orders (Fastify)
//   2. Real-time subscription via Supabase Realtime —
//      listens to the 'orders' table for INSERT/UPDATE events
//      and refreshes the list instantly without polling.
//   3. Status filter tabs (All / Pending / Processing / ...)
//   4. Per-row status updater (PATCH /admin/orders/:id)
//   5. Live indicator badge (Wifi / WifiOff icon)
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { OrderRow }       from '../components/OrderRow';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { LoadingSpinner } from '../../../core/components/LoadingSpinner';
import { OrderService }   from '../api_services/order_service';
import { supabase }       from '../../../core/lib/supabase';
import type { Order, OrderStatus } from '../../../core/types';
import toast from 'react-hot-toast';

type FilterTab = 'all' | OrderStatus;
const TABS: FilterTab[] = ['all', 'pending', 'processing', 'completed', 'cancelled'];

export default function OrdersPage() {
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [filter,      setFilter]      = useState<FilterTab>('all');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await OrderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('admin-orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        payload => {
          if (payload.eventType === 'INSERT') {
            fetchOrders();
            toast('New order received!', { icon: '🔔' });
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev =>
              prev.map(o =>
                o.id === (payload.new as Order).id
                  ? { ...o, ...(payload.new as Partial<Order>) }
                  : o,
              ),
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev =>
              prev.filter(o => o.id !== (payload.old as Order).id),
            );
          }
        },
      )
      .subscribe(status => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  const handleStatusUpdated = (id: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: newStatus } : o)),
    );
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-[1200px] mx-auto animate-[fadeIn_0.3s_ease]">

      {/* Header row */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-semibold text-text-main mb-1">Orders</h1>
          <p className="text-sm text-text-muted">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${isConnected ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{isConnected ? 'Live' : 'Connecting…'}</span>
          </div>
          <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-text-main shadow-sm border border-[#F3F4F6] hover:bg-[#F3F4F6] hover:text-primary transition-colors" onClick={fetchOrders} title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === tab 
                ? 'bg-dark border-dark text-white' 
                : 'bg-white border border-[#E2E8F0] text-text-muted hover:border-[#CBD5E1] hover:text-text-main'
            }`}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className={`px-1.5 py-0.5 rounded-[10px] text-[11px] ${filter === tab ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
              {tab === 'all' ? orders.length : orders.filter(o => o.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
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
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider bg-[#F8FAFC] border-b border-[#E2E8F0]">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onStatusUpdated={handleStatusUpdated}
                  onViewDetails={setSelectedOrder}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-text-muted p-12">
                    No {filter === 'all' ? '' : filter} orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailModal
        isOpen={selectedOrder !== null}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
