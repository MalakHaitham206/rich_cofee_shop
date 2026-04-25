
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const StatsCard: React.FC<Props> = ({ label, value, icon: Icon, color, bgColor }) => (
  <div className="bg-surface rounded-2xl p-6 shadow-sm flex flex-col">
    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4" style={{ backgroundColor: bgColor }}>
      <Icon size={22} color={color} />
    </div>
    <p className="text-[28px] font-bold text-text-main mb-1">{value}</p>
    <p className="text-sm font-medium text-text-muted">{label}</p>
  </div>
);
