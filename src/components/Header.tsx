import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, ShoppingBag, UserCircle, LogOut, ClipboardList, Database, Menu, X, ArrowLeft } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    cart,
    currentUser,
    logoutUser,
    setShowSupabaseGuide,
    setSelectedProduct
  } = useShop();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate total items in the cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogoClick = () => {
    setSelectedProduct(null);
    setCurrentPage('home');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-20 bg-white border-b border-slate-200 shadow-sm" id="shopease-main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleLogoClick}
                className="flex items-center gap-2 bg-transparent border-none text-left focus:outline-none cursor-pointer group"
                id="btn-header-logo"
              >
                <span className="text-2xl font-black text-indigo-600 tracking-tighter font-sans">
                  ShopEase
                </span>
              </button>
            </div>

            {/* Global Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative" id="header-search-container">
              <span className="absolute left-4 inset-y-0 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 placeholder-slate-400"
                id="header-search-input"
              />
            </div>

            {/* Desktop Action Items */}
            <div className="hidden lg:flex items-center gap-6 shrink-0">
              {/* Supabase Indicator / Setup */}
              <button
                onClick={() => setShowSupabaseGuide(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition-colors cursor-pointer"
                id="btn-header-supabase-setup"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase</span>
              </button>

              {/* Order History link */}
              {currentUser && (
                <button
                  onClick={() => setCurrentPage('orders')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    currentPage === 'orders'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  id="btn-header-history-desktop"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>My Orders</span>
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setCurrentPage('cart');
                }}
                className={`relative p-2.5 rounded-2xl transition-all cursor-pointer border ${
                  currentPage === 'cart'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                id="btn-header-cart-desktop"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5.5 h-5.5" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse"
                    id="cart-badge-desktop"
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Authentication Status widget */}
              {currentUser ? (
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4" id="header-user-widget">
                  {currentUser.avatar_url ? (
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.full_name || 'User Profile'}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-2 ring-indigo-50"
                      referrerPolicy="no-referrer"
                      id="img-header-profile-avatar"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-black text-sm">
                      {(currentUser.full_name || currentUser.email).substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left shrink-0 max-w-[120px]">
                    <p className="text-xs font-bold text-slate-800 truncate" id="text-header-username">
                      {currentUser.full_name || currentUser.email.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={logoutUser}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    id="btn-header-logout"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold transition-all cursor-pointer shadow-lg shadow-slate-100"
                  id="btn-header-login-desktop"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile / Tablet Controls (Right aligned) */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setShowSupabaseGuide(true)}
                className="p-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                id="btn-header-supabase-setup-mobile"
                title="Database setup instruction"
              >
                <Database className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setCurrentPage('cart');
                }}
                className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-50-mobile"
                id="btn-header-cart-mobile"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce shadow"
                    id="cart-badge-mobile"
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="btn-mobile-menu-toggle"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Search - Only visible on sm screens */}
        <div className="md:hidden px-4 pb-4 border-b border-gray-50">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-gray-50/50"
              id="header-search-mobile-input"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md py-4 px-4 shadow-xl" id="menu-dropdown-mobile">
            <div className="flex flex-col gap-3">
              {currentUser && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.full_name || 'User Profile'}
                    className="w-10 h-10 rounded-full"
                    id="img-header-profile-avatar-mobile"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {currentUser.full_name || currentUser.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                  </div>
                </div>
              )}

              {/* Menu items */}
              <button
                onClick={() => {
                  handleLogoClick();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold transition-colors flex items-center gap-2 ${
                  currentPage === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                id="btn-mobile-nav-home"
              >
                <ArrowLeft className="w-4 h-4" /> Home Shop
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    setCurrentPage('orders');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold transition-colors flex items-center gap-2 ${
                    currentPage === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  id="btn-mobile-nav-history"
                >
                  <ClipboardList className="w-4 h-4" /> My Active Orders
                </button>
              )}

              {currentUser ? (
                <button
                  onClick={() => {
                    logoutUser();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-left text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2"
                  id="btn-mobile-nav-logout"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 text-white text-center font-bold hover:bg-indigo-700 transition-colors"
                  id="btn-mobile-nav-login"
                >
                  Sign In to ShopEase
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Setup Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
