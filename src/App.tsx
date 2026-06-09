import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrderHistoryView } from './components/OrderHistoryView';
import { ToastContainer } from './components/Toast';
import { SupabaseGuide } from './components/SupabaseGuide';
import { Category } from './types';
import { Filter, Star, CheckCircle, Database, HelpCircle, Loader2 } from 'lucide-react';

const CATEGORIES: Category[] = ['All', 'Electronics', 'Fashion', 'Food', 'Beauty'];

const AppContent: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    products,
    isLoadingProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
  } = useShop();

  // Filter products based on search queries and category filter chips
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render Skeleton Placeholders for the product grid
  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" id="skeleton-grid-body">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <div key={n} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse-slow">
          <div className="aspect-square bg-gray-100 rounded-xl" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-gray-100 rounded w-1/3" />
            <div className="h-8 bg-gray-100 rounded-xl w-8" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 font-sans" id="shopease-app-canvas">
      
      {/* Universal Header */}
      <Header />

      {/* Primary Routing view switcher */}
      <main className="flex-grow py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {currentPage === 'home' && (
            <div className="space-y-10" id="home-view-canvas">
              {/* Promotional Hero Block */}
              {!searchQuery && <Hero />}

              {/* Category Filter bar and Title */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5"
                id="catalog-section"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight font-sans flex items-center gap-1.5 pl-0.5">
                    {searchQuery ? (
                      <span>Search Results for "{searchQuery}"</span>
                    ) : (
                      <span>Explore Our Collections</span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-1">Handpicked organic aesthetic products with express transit shipping</p>
                </div>

                {/* Filter chip segments */}
                <div className="flex gap-3 overflow-x-auto pb-2 max-w-full shrink-0" id="category-chips-row">
                  {CATEGORIES.map((catKey) => (
                    <button
                      key={catKey}
                      onClick={() => setSelectedCategory(catKey)}
                      className={`px-6 py-2 rounded-2xl text-sm transition-all shrink-0 cursor-pointer ${
                        selectedCategory === catKey
                          ? 'bg-indigo-600 text-white font-bold shadow-md'
                          : 'bg-white text-slate-600 font-semibold border border-slate-200 hover:border-indigo-300'
                      }`}
                      id={`chip-cat-${catKey}`}
                    >
                      {catKey}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product listing block */}
              {isLoadingProducts ? (
                <SkeletonGrid />
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-150 p-8 flex flex-col items-center gap-4 max-w-md mx-auto" id="results-empty-state">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Filter className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">No Matching Products</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      We couldn't search or verify any items matching your criteria. Try adjusting filters or searching for alternative names.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold rounded-xl text-xs cursor-pointer"
                    id="btn-filters-reset"
                  >
                    Clear Filter Parameters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-in" id="products-catalog-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentPage === 'cart' && <CartView />}
          {currentPage === 'checkout' && <CheckoutView />}
          {currentPage === 'orders' && <OrderHistoryView />}

        </div>
      </main>

      {/* Global Footer components panel */}
      <footer className="bg-white border-t border-gray-150 py-10" id="shopease-main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            
            <div className="space-y-1.5">
              <span className="text-base font-extrabold text-indigo-950 font-sans block">ShopEase E-Commerce</span>
              <p className="text-xs text-gray-400 max-w-md font-sans">
                A visual showcase of a modern client e-commerce platform incorporating rich responsive checkout pathways with automated storage schemas.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 pl-2">
              <span>© {new Date().getFullYear()} ShopEase Ltd.</span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <button
                onClick={() => setCurrentPage('orders')}
                className="hover:text-indigo-600 cursor-pointer bg-white"
                id="btn-footer-logs"
              >
                Delivery Check
              </button>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                Supabase Engine
              </a>
            </div>

          </div>
        </div>
      </footer>

      {/* Global Modals, Indicators & Toasts overlay containers */}
      <ProductDetailModal />
      <ToastContainer />
      <SupabaseGuide />

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
