import React, { createContext, useContext, useState, useCallback } from 'react';

// Using the same Product interface from ProductCard
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  image_url?: string;
}

export interface CartItem {
  id: string; // unique ID for the cart item (could just be product id if we don't have variations)
  product: Product;
  quantity: number;
  variationText: string; // "single | iced | medium | full ice"
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      if (existingItem) {
        // If it's already in the cart, increase quantity
        return currentItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      
      // Otherwise, add new item with default mock variations
      return [...currentItems, {
        id: product.id,
        product,
        quantity: 1,
        variationText: "single | iced | medium | full ice"
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((currentItems) => currentItems.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const price = typeof item.product.price === 'string' 
        ? parseFloat(item.product.price) 
        : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }, [items]);

  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.product.id === productId);
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
