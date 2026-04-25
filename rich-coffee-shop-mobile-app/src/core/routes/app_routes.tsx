export const AppRoutes = {
  WELCOME: '/welcome',
  LOGIN: '/login',
  SIGNUP: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  CART: '/cart',
  PRODUCT_DETAILS: '/product-details',
  HISTORY_ORDERS: '/history',
  ORDER_CONFIRMATION: '/order-confirmation',
  HOME: '/home',
} as const;

export type AppRoute = typeof AppRoutes[keyof typeof AppRoutes];
