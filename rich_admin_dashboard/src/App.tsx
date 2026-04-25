import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './core/context/AuthContext';
import { AppRoutes } from './core/routes/app_routes';
import { Sidebar }   from './core/components/Sidebar';
import { LoadingSpinner } from './core/components/LoadingSpinner';

// Pages
import LoginPage     from './features/auth/pages/LoginPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import OrdersPage    from './features/orders/pages/OrdersPage';
import ProductsPage  from './features/products/pages/ProductsPage';

/**
 * Layout wrap for protected pages — includes the Sidebar
 * and the main content area container.
 */
const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[260px] p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

/**
 * Route guard: Redirects to /login if not authenticated or not admin.
 * If AuthContext is still loading from localStorage, shows a spinner.
 */
const ProtectedRoute = () => {
  const { token, isAdmin, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!token || !isAdmin) return <Navigate to={AppRoutes.LOGIN} replace />;

  return <AdminLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          
          {/* Public Route */}
          <Route path={AppRoutes.LOGIN} element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to={AppRoutes.DASHBOARD} replace />} />
            
            <Route path={AppRoutes.DASHBOARD} element={<DashboardPage />} />
            <Route path={AppRoutes.ORDERS}    element={<OrdersPage />} />
            <Route path={AppRoutes.PRODUCTS}  element={<ProductsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={AppRoutes.DASHBOARD} replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
