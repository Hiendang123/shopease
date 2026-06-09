import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, Category, ShippingDetails } from '../types';
import { db, isSupabaseConfigured } from '../lib/db';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  currentPage: 'home' | 'cart' | 'checkout' | 'orders';
  setCurrentPage: (page: 'home' | 'cart' | 'checkout' | 'orders') => void;
  products: Product[];
  isLoadingProducts: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  currentUser: User | null;
  authLoading: boolean;
  loginUser: (email: string) => Promise<boolean>;
  signupUser: (email: string, fullName: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  orders: Order[];
  isLoadingOrders: boolean;
  placeOrder: (shipping: ShippingDetails, paymentMethod: 'Credit Card' | 'Cash on Delivery') => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  showSupabaseGuide: boolean;
  setShowSupabaseGuide: (show: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<'home' | 'cart' | 'checkout' | 'orders'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showSupabaseGuide, setShowSupabaseGuide] = useState(false);

  // Load active user session on start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await db.getSessionUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await db.getProducts();
      setProducts(data);
    } catch (err) {
      addToast('Error loading catalog. Using stored backup.', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch orders when user changes or visits orders page
  const fetchOrders = async () => {
    if (!currentUser) return;
    setIsLoadingOrders(true);
    try {
      const data = await db.getOrders(currentUser.id);
      setOrders(data);
    } catch (err) {
      addToast('Could not load order history.', 'error');
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [currentUser]);

  // Toast utilities
  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock_quantity <= 0) {
      addToast(`Sorry, ${product.name} is currently out of stock.`, 'error');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      const activeQty = existing ? existing.quantity : 0;
      const finalQty = activeQty + quantity;

      if (finalQty > product.stock_quantity) {
        addToast(`Cannot add more. Only ${product.stock_quantity} units available.`, 'error');
        return prevCart;
      }

      addToast(`Added ${quantity}x ${product.name} to cart.`, 'success');

      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: finalQty } : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > product.stock_quantity) {
      addToast(`Only ${product.stock_quantity} units in stock.`, 'error');
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product.id === productId);
      if (item) {
        addToast(`Removed ${item.product.name} from cart.`, 'info');
      }
      return prevCart.filter((i) => i.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Auth commands
  const loginUser = async (email: string) => {
    try {
      const user = await db.signIn(email);
      setCurrentUser(user);
      addToast(`Welcome back, ${user.full_name || email}!`, 'success');
      return true;
    } catch (err) {
      addToast('Sign in failed.', 'error');
      return false;
    }
  };

  const signupUser = async (email: string, fullName: string) => {
    try {
      const user = await db.signUp(email, fullName);
      setCurrentUser(user);
      addToast(`Account created! Welcome, ${fullName}!`, 'success');
      return true;
    } catch (err) {
      addToast('Sign up failed.', 'error');
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await db.signOut();
      setCurrentUser(null);
      addToast('Signed out successfully.', 'info');
      setCurrentPage('home');
    } catch (err) {
      addToast('Logout error.', 'error');
    }
  };

  // Place Order
  const placeOrder = async (shipping: ShippingDetails, paymentMethod: 'Credit Card' | 'Cash on Delivery') => {
    if (cart.length === 0) {
      addToast('Your cart is empty.', 'error');
      return;
    }

    // Free shipping if order value > $50
    const subtotal = cart.reduce((acc, c) => acc + c.product.price * c.quantity, 0);
    const shippingFee = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shippingFee;

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const orderItems = cart.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image_url: item.product.image_url,
    }));

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: 'Pending',
      total_price: total,
      items: orderItems,
      shipping_details: shipping,
      payment_method: paymentMethod,
    };

    try {
      // Connect to active user; if none active, register a fast checkout session
      let userId = currentUser?.id;
      if (!userId) {
        // Create an anonymous/instant user name
        const guestEmail = shipping.email;
        const guestUser = await db.signUp(guestEmail, shipping.name);
        setCurrentUser(guestUser);
        userId = guestUser.id;
      }

      await db.saveOrder(newOrder, userId);
      
      // Sync Catalog stock count immediately
      await fetchProducts();
      // Fetch latest orders
      await fetchOrders();

      clearCart();
      addToast(`Order placed successfully! ID: ${orderId}`, 'success');
      setCurrentPage('orders');
    } catch (err) {
      addToast('Failed to write transaction.', 'error');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        products,
        isLoadingProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        currentUser,
        authLoading,
        loginUser,
        signupUser,
        logoutUser,
        orders,
        isLoadingOrders,
        placeOrder,
        selectedProduct,
        setSelectedProduct,
        toasts,
        addToast,
        removeToast,
        showSupabaseGuide,
        setShowSupabaseGuide,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
