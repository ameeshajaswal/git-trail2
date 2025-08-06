import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  appliedCoupon: string | null;
  discount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const subtotal = newItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
      }, 0);
      
      const total = subtotal - (subtotal * state.discount / 100);
      
      return { ...state, items: newItems, total };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const subtotal = newItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
      }, 0);
      
      const total = subtotal - (subtotal * state.discount / 100);
      
      return { ...state, items: newItems, total };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const subtotal = newItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
      }, 0);
      
      const total = subtotal - (subtotal * state.discount / 100);
      
      return { ...state, items: newItems, total };
    }
    
    case 'APPLY_COUPON': {
      const subtotal = state.items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
      }, 0);
      
      const total = subtotal - (subtotal * action.payload.discount / 100);
      
      return {
        ...state,
        appliedCoupon: action.payload.code,
        discount: action.payload.discount,
        total
      };
    }
    
    case 'REMOVE_COUPON': {
      const subtotal = state.items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return sum + (price * item.quantity);
      }, 0);
      
      return {
        ...state,
        appliedCoupon: null,
        discount: 0,
        total: subtotal
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        appliedCoupon: null,
        discount: 0
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  total: 0,
  appliedCoupon: null,
  discount: 0
};

// Available coupons
const AVAILABLE_COUPONS = {
  'WELCOME10': { discount: 10, description: '10% off your order' },
  'COFFEE20': { discount: 20, description: '20% off your order' },
  'STUDENT15': { discount: 15, description: '15% student discount' }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = AVAILABLE_COUPONS[code.toUpperCase() as keyof typeof AVAILABLE_COUPONS];
    if (coupon) {
      dispatch({ 
        type: 'APPLY_COUPON', 
        payload: { code: code.toUpperCase(), discount: coupon.discount } 
      });
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      getItemCount
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