// ============================================================
// OrderRow.tsx — Feature: Orders
// One table row per order with an inline status <select>.
// When the dropdown changes:
//   1. Call OrderService.updateStatus() → PATCH /admin/orders/:id
//   2. Call onStatusUpdated() to sync parent state immediately
//      (optimistic UI — no need to refetch the whole list)
// ============================================================

import { useState } from 'react';
import { OrderStatusBadge } from '../../../core/components/OrderStatusBadge';
import { OrderService }     from '../api_services/order_service';
import type { Order, OrderStatus } from '../../../core/types';
import toast from 'react-hot-toast';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];

interface Props {
  order: Order;
  onStatusUpdated: (id: string, newStatus: OrderStatus) => void;
  onViewDetails?: (order: Order) => void;
}

export const OrderRow: React.FC<Props> = ({ order, onStatusUpdated, onViewDetails }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === order.status) return;

    setIsUpdating(true);
    try {
      await OrderService.updateStatus(order.id, newStatus);
      onStatusUpdated(order.id, newStatus); 
      toast.success('Status updated');
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className={`hover:bg-[#F8FAFC] ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle font-mono text-text-muted">#{order.id.slice(0, 8)}</td>

      <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">{order.profiles?.name ?? 'Unknown'}</td>

      <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">
        <div className="flex flex-wrap gap-1.5">
          {order.order_items?.map(item => (
            <span key={item.id} className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap">
              {item.products?.name} ×{item.quantity}
            </span>
          )) ?? '—'}
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">EGP {Number(order.total_amount).toFixed(2)}</td>

      <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle"><OrderStatusBadge status={order.status} /></td>

      <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">{new Date(order.created_at).toLocaleString()}</td>

      <td className="px-6 py-4 text-sm text-text-main border-b border-[#F1F5F9] align-middle">
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 border border-[#E2E8F0] rounded-lg font-sans text-[13px] font-medium text-text-main bg-white cursor-pointer outline-none focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
            value={order.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(order)}
              className="text-xs font-semibold text-primary hover:text-primary-hover px-2 py-1"
            >
              Details
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
