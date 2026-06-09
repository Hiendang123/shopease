import React, { useState } from 'react';
import { Database, Copy, Check, X, ShieldAlert, Layers } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { isSupabaseConfigured } from '../lib/db';

export const SupabaseGuide: React.FC = () => {
  const { showSupabaseGuide, setShowSupabaseGuide } = useShop();
  const [copied, setCopied] = useState(false);

  if (!showSupabaseGuide) return null;

  const sqlSchema = `-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    rating NUMERIC DEFAULT 4.0,
    rating_count INT DEFAULT 0,
    stock_quantity INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Populate Initial High-Quality Products
INSERT INTO public.products (id, name, price, description, category, image_url, rating, rating_count, stock_quantity)
VALUES 
('prod-001', 'AcousticMax Wireless Headphones', 129.99, 'Immersive sound with premium hybrid active noise cancellation...', 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 4.8, 124, 15),
('prod-002', 'ChronoLite Smart Fitness Watch', 89.50, 'Track your health and lifestyle...', 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 4.5, 89, 24),
('prod-003', 'Vagabond Canvas Daypack', 59.00, 'A robust water-resistant laptop backpack...', 'Fashion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 4.7, 212, 8),
('prod-004', 'Somerset Amber Sunglasses', 45.00, 'Classic handcrafted acetate frames...', 'Fashion', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 4.3, 56, 12),
('prod-005', 'Artisan Dark Roast Coffee Beans (1kg)', 24.99, 'Single-origin certified organic roasted beans...', 'Food', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800', 4.9, 340, 50),
('prod-006', 'Uji Ceremonal Grade Matcha Powder', 38.00, 'Pure ceremonial-grade matcha from Uji...', 'Food', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800', 4.6, 118, 30),
('prod-007', 'Luminous Glow Hydrating Serum', 32.50, 'Infused with Hyaluronic Acid and Niacinamide...', 'Beauty', 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=800', 4.7, 145, 18),
('prod-008', 'Velvet Rose Handcrafted Soy Candle', 18.00, 'Hand-poured candle with soothing rose oil...', 'Beauty', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800', 4.4, 73, 40)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Shipped', 'Delivered')),
    payment_method TEXT NOT NULL,
    shipping_name TEXT NOT NULL,
    shipping_email TEXT NOT NULL,
    shipping_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INT NOT NULL,
    image_url TEXT
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="supabase-guide-root">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 relative max-h-[85vh] overflow-y-auto border border-gray-100" id="supabase-guide-card">
        <button
          onClick={() => setShowSupabaseGuide(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none p-1.5 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Close guide"
          id="btn-close-guideline"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900" id="guide-title">Supabase Database Setup</h2>
            <p className="text-sm text-gray-500">How to link and query your real database</p>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-indigo-900" id="env-guide-box">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-indigo-600" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Setup Connection Keys</p>
            <p>
              ShopEase falls back to <span className="font-semibold">LocalStorage State</span> by default so you can test features
              without delay. To connect to Supabase, populate these secrets in the settings panel:
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 font-mono text-[10px] text-indigo-700 bg-white/50 p-2 rounded border border-indigo-100">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Table Schemas & Seeding
            </span>
            <button
              onClick={copySql}
              className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors border border-emerald-200"
              id="btn-copy-sql"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy SQL
                </>
              )}
            </button>
          </div>

          <pre className="text-[10px] font-mono bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto max-h-60 border border-gray-800 shadow-inner">
            {sqlSchema}
          </pre>
        </div>

        <div className="text-xs text-gray-500 space-y-2 pt-2 border-t border-gray-100">
          <p className="font-semibold text-gray-700">Steps to active real database integration:</p>
          <ol className="list-decimal pl-4 space-y-1.5 text-gray-600">
            <li>Create a new project on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Supabase</a>.</li>
            <li>Go to the <span className="font-semibold">SQL Editor</span> tab inside Supabase dashboard.</li>
            <li>Paste this SQL block and hit <span className="font-bold">Run</span> to instantiate all tables and catalog configurations instantly.</li>
            <li>Copy your <span className="font-semibold">Project URL</span> and <span className="font-semibold">Anon API key</span> from Project settings into your App Secrets.</li>
          </ol>
        </div>

        <button
          onClick={() => setShowSupabaseGuide(false)}
          className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-semibold text-sm cursor-pointer"
          id="btn-guide-close-primary"
        >
          Got it, Close Guide
        </button>
      </div>
    </div>
  );
};
