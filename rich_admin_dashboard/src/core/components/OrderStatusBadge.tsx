// ============================================================
// OrderStatusBadge.tsx
// Colored pill badge for order status — matches the mobile
// app's status display concept.
// Colors:
//   pending    → amber  (#F59E0B)
//   processing → blue   (#3B82F6)
//   completed  → green  (#10B981)
//   cancelled  → red    (#ED5151)
// ============================================================

import type { OrderStatus } from '../types';

const CONFIG: Record<OrderStatus, { label: string; cls: string }> = {
  pending:    { label: 'Pending',    cls: 'bg-[#FEF3C7] text-[#B45309]' },
  processing: { label: 'Processing', cls: 'bg-[#DBEAFE] text-[#1D4ED8]' },
  completed:  { label: 'Completed',  cls: 'bg-[#D1FAE5] text-[#047857]' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-[#FEE2E2] text-[#B91C1C]' },
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const conf = CONFIG[status] ?? CONFIG.pending;
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${conf.cls}`}>{conf.label}</span>;
};
