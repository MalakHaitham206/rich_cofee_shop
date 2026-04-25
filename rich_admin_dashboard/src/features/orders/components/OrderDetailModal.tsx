import React from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { OrderStatusBadge } from '../../../core/components/OrderStatusBadge';
import type { Order } from '../../../core/types';

interface Props {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<Props> = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center z-50 backdrop-blur-[2px] p-6 overflow-hidden" onClick={onClose}>
      <div className="bg-surface rounded-[24px] p-8 w-full max-w-[600px] shadow-lg animate-modalScale relative max-h-[90vh] overflow-y-auto flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[24px] font-semibold text-text-main flex items-center gap-2">
              <ShoppingBag size={24} color="#C67C4E" />
              Order #{order.id.slice(0, 8)}
            </h3>
            <p className="text-sm text-text-muted mt-1">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <button className="w-8 h-8 rounded-lg bg-[#F3F4F6] text-text-main flex items-center justify-center hover:bg-[#E5E7EB] transition-colors" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Customer & Status Info */}
        <div className="flex justify-between items-center bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] mb-6">
          <div>
            <p className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">Customer</p>
            <p className="text-[15px] font-semibold text-text-main">{order.profiles?.name ?? 'Unknown Customer'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted font-medium mb-1 uppercase tracking-wider">Status</p>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1">
          <h4 className="text-base font-semibold text-text-main mb-4">Order Items</h4>
          <div className="flex flex-col gap-4">
            {order.order_items?.map(item => (
              <div key={item.id} className="flex justify-between items-center pb-4 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  {item.products?.image_url ? (
                    <img src={item.products.image_url} alt={item.products.name} className="w-12 h-12 rounded-lg object-cover bg-[#F3F4F6]" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                      <ShoppingBag size={20} color="#9CA3AF" />
                    </div>
                  )}
                  <div>
                    <p className="text-[15px] font-medium text-text-main">{item.products?.name ?? 'Unknown Product'}</p>
                    <p className="text-sm text-text-muted">EGP {Number(item.unit_price).toFixed(2)} x {item.quantity}</p>
                  </div>
                </div>
                <p className="text-[15px] font-semibold text-text-main">
                  EGP {(Number(item.unit_price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
            {(!order.order_items || order.order_items.length === 0) && (
              <p className="text-sm text-text-muted text-center py-4">No items in this order.</p>
            )}
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex justify-between items-center">
          <p className="text-base font-medium text-text-muted">Total Amount</p>
          <p className="text-[24px] font-bold text-text-main">EGP {Number(order.total_amount).toFixed(2)}</p>
        </div>

      </div>
    </div>
  );
};
