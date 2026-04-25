// Route constants — mirrors the mobile app's AppRoutes pattern
export const AppRoutes = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  PRODUCTS: '/products',
} as const;

export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];
