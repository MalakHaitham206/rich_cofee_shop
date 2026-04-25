// ============================================================
// Sidebar.tsx — Core Component
// Dark sidebar (#1E1E1E) matching the mobile app's dark header.
// Uses React Router's NavLink for active-state highlighting:
//   active item → coffee brown (#C67C4E) text + icon
//   inactive    → muted gray
//
// Structure:
//   • Logo section (Coffee icon + brand name)
//   • Nav items (Dashboard, Orders, Products)
//   • Footer (user avatar initial + name + logout button)
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppRoutes } from '../routes/app_routes';

// Nav item definitions
const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, route: AppRoutes.DASHBOARD },
  { label: 'Orders',    icon: ShoppingBag,     route: AppRoutes.ORDERS    },
  { label: 'Products',  icon: Package,         route: AppRoutes.PRODUCTS  },
];

export const Sidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate(AppRoutes.LOGIN);
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-dark text-white flex flex-col p-8 z-40">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Coffee size={24} color="#C67C4E" />
        </div>
        <div>
          <p className="text-xl font-bold leading-tight">Rich Coffee</p>
          <p className="text-xs text-[#A0A0A0] font-normal">Admin Panel</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex flex-col gap-2 flex-1">
        {NAV_ITEMS.map(({ label, icon: Icon, route }) => (
          <NavLink
            key={route}
            to={route}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-4 rounded-xl font-medium text-[15px] transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#A0A0A0] hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div className="flex items-center gap-3">
          {/* Avatar: first letter of name */}
          <div className="w-9 h-9 rounded-full bg-surface text-dark flex items-center justify-center font-semibold text-base">
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-[#A0A0A0]">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="text-[#A0A0A0] p-2 rounded-lg hover:text-error hover:bg-error/10 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>

    </aside>
  );
};
