import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

/**
 * Holds the current user's cart. Loads on login, clears on logout, and updates
 * from the backend's response after every mutation (the API returns the full cart).
 */
export function CartProvider({ children }) {
  const { isAuthenticated, role } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || role !== 'CUSTOMER') {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      setCart(await cartService.getCart());
    } catch {
      // ignore – cart simply stays as-is
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = async (pizzaId, quantity = 1) => {
    const data = await cartService.addToCart({ pizzaId, quantity });
    setCart(data);
    return data;
  };

  const updateItem = async (cartItemId, quantity) => {
    const data = await cartService.updateItem({ cartItemId, quantity });
    setCart(data);
    return data;
  };

  const removeItem = async (cartItemId) => {
    const data = await cartService.removeItem(cartItemId);
    setCart(data);
    return data;
  };

  const clear = async () => {
    const data = await cartService.clearCart();
    setCart(data);
    return data;
  };

  const value = {
    cart,
    items: cart?.items || [],
    totalItems: cart?.totalItems || 0,
    subtotal: cart?.subtotal || 0,
    loading,
    refresh,
    addItem,
    updateItem,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
