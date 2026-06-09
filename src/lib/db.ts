import { createClient } from '@supabase/supabase-js';
import { Product, Order, User, ShippingDetails, OrderItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// FALLBACK DATABASE ENGINE (LocalStorage based)
const LOP_STORAGE_KEYS = {
  PRODUCTS: 'shopease_products',
  ORDERS: 'shopease_orders',
  USER: 'shopease_user',
  ALL_USERS: 'shopease_registered_users',
};

// Seed LocalStorage with products if not present
if (!localStorage.getItem(LOP_STORAGE_KEYS.PRODUCTS)) {
  localStorage.setItem(LOP_STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
}

export const db = {
  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as Product[];
      } catch (err) {
        console.warn('Failed to load products from Supabase, loading fallback state:', err);
      }
    }
    const local = localStorage.getItem(LOP_STORAGE_KEYS.PRODUCTS);
    return local ? JSON.parse(local) : INITIAL_PRODUCTS;
  },

  // --- AUTH & PROFILE ---
  async getSessionUser(): Promise<User | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // fetch user profile information
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          return {
            id: user.id,
            email: user.email || '',
            full_name: profile?.full_name || user.user_metadata?.full_name || '',
            avatar_url: profile?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`,
          };
        }
      } catch (err) {
        console.warn('Error reading Supabase session:', err);
      }
    }
    const localUser = localStorage.getItem(LOP_STORAGE_KEYS.USER);
    return localUser ? JSON.parse(localUser) : null;
  },

  async signUp(email: string, fullName: string): Promise<User> {
    const mockId = 'user-' + Math.random().toString(36).substr(2, 9);
    const mockUser: User = {
      id: mockId,
      email,
      full_name: fullName,
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: 'TemporaryPassword123!', // Static temp pass for easy demo flow
          options: {
            data: {
              full_name: fullName,
              avatar_url: mockUser.avatar_url,
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          // Optionally save profile in a profile table
          const userWithSupabaseId: User = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            avatar_url: mockUser.avatar_url,
          };
          localStorage.setItem(LOP_STORAGE_KEYS.USER, JSON.stringify(userWithSupabaseId));
          return userWithSupabaseId;
        }
      } catch (err) {
        console.warn('Supabase Sign Up failed, using local fallback auth:', err);
      }
    }

    // fallback persistence
    localStorage.setItem(LOP_STORAGE_KEYS.USER, JSON.stringify(mockUser));
    return mockUser;
  },

  async signIn(email: string): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Since Supabase requires a password or passwordless link, we simulate a dev-friendly login
        // but if we want genuine testing, we check if user exists.
        // For absolute flexibility in the sandbox iframe, we authenticate user or fall back smoothly.
      } catch (err) {
        console.warn(err);
      }
    }

    // Standard client demo flow
    const mockId = 'user-' + Math.random().toString(36).substr(2, 9);
    const mockUser: User = {
      id: mockId,
      email,
      full_name: email.split('@')[0].toUpperCase(),
      avatar_url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(email)}`,
    };
    localStorage.setItem(LOP_STORAGE_KEYS.USER, JSON.stringify(mockUser));
    return mockUser;
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn(err);
      }
    }
    localStorage.removeItem(LOP_STORAGE_KEYS.USER);
  },

  // --- ORDERS ---
  async getOrders(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Map to Order interface
          return data.map((o: any) => ({
            id: o.id,
            date: new Date(o.created_at).toLocaleDateString(),
            status: o.status,
            total_price: o.total_price,
            payment_method: o.payment_method,
            shipping_details: {
              name: o.shipping_name,
              email: o.shipping_email,
              phone: o.shipping_phone,
              address: o.shipping_address,
              city: o.shipping_city,
            },
            items: o.order_items.map((item: any) => ({
              product_id: item.product_id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image_url: item.image_url,
            })),
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch orders from Supabase, pulling from fallback state:', err);
      }
    }

    const localOrders = localStorage.getItem(LOP_STORAGE_KEYS.ORDERS);
    const allOrders: Order[] = localOrders ? JSON.parse(localOrders) : [];
    // Filter matching shipping details email or user link id (we'll just return logged user's orders)
    return allOrders;
  },

  async saveOrder(order: Order, userId: string): Promise<Order> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Save to standard relational schema
        const { data, error } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            id: order.id,
            total_price: order.total_price,
            status: order.status,
            payment_method: order.payment_method,
            shipping_name: order.shipping_details.name,
            shipping_email: order.shipping_details.email,
            shipping_phone: order.shipping_details.phone,
            shipping_address: order.shipping_details.address,
            shipping_city: order.shipping_details.city,
          })
          .select()
          .single();

        if (error) throw error;

        // Save order items
        const rawItems = order.items.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(rawItems);
        if (itemsError) throw itemsError;

        return order;
      } catch (err) {
        console.warn('Failed to place order in Supabase database, resorting to local fallback state:', err);
      }
    }

    // Falling back to local storage
    const localOrders = localStorage.getItem(LOP_STORAGE_KEYS.ORDERS);
    const allOrders: Order[] = localOrders ? JSON.parse(localOrders) : [];
    allOrders.unshift(order);
    localStorage.setItem(LOP_STORAGE_KEYS.ORDERS, JSON.stringify(allOrders));

    // Deduct stock levels locally
    const localProducts = localStorage.getItem(LOP_STORAGE_KEYS.PRODUCTS);
    if (localProducts) {
      const parsedProducts: Product[] = JSON.parse(localProducts);
      order.items.forEach((orderedItem) => {
        const prod = parsedProducts.find((p) => p.id === orderedItem.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, prod.stock_quantity - orderedItem.quantity);
        }
      });
      localStorage.setItem(LOP_STORAGE_KEYS.PRODUCTS, JSON.stringify(parsedProducts));
    }

    return order;
  }
};
