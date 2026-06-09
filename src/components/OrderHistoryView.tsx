import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ClipboardCheck, ArrowLeft, ChevronDown, ChevronUp, UserCheck, ShieldClose, Hourglass, Truck, CheckCircle2 } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const OrderHistoryView: React.FC = () => {
  const {
    orders,
    isLoadingOrders,
    currentUser,
    setCurrentPage,
  } = useShop();

  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusBadge = (status: 'Pending' | 'Shipped' | 'Delivered') => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <Hourglass className="w-3.5 h-3.5 animate-spin" /> Pending
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
    }
  };

  // 1. Guard check: Require Login
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 flex flex-col items-center gap-6" id="history-unauthenticated-root">
        <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-600 mb-2">
          <UserCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 font-sans tracking-tight">Identity Authentication Required</h2>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
            Please sign in using your account credentials to securely read, organize, and monitor your personal order histories.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl transition-all cursor-pointer shadow-indigo-100 shadow-md text-sm"
            id="btn-history-req-login"
          >
            Authenticate Identity
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all cursor-pointer text-sm"
            id="btn-history-req-cancel"
          >
            Return to Catalogue
          </button>
        </div>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  // 2. State loading
  if (isLoadingOrders) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 space-y-6" id="history-loading">
        <div className="h-6 w-48 bg-gray-100 animate-pulse rounded-lg" />
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-24 bg-gray-50 animate-pulse rounded-2xl border border-gray-150" />
          ))}
        </div>
      </div>
    );
  }

  // 3. Page core items
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10" id="history-view-root">
      
      {/* Upper navigation */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8" id="history-header">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight font-sans">Purchasing Logs</h1>
          <p className="text-xs text-gray-400">Order verification and real-time transit telemetry</p>
        </div>
        <button
          onClick={() => setCurrentPage('home')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer bg-white"
          id="btn-history-back-shop"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </button>
      </div>

      {/* 4. State empty check */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-5" id="history-no-items">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-gray-900">No Orders Yet</h3>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              You haven't placed any shopping orders yet. Browse our list collections and purchase premium products today.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('home')}
            className="mt-1 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 transition-colors cursor-pointer"
            id="btn-history-shop-now"
          >
            Start Shpping Now
          </button>
        </div>
      ) : (
        <div className="space-y-4" id="history-orders-list-block">
          {orders.map((order) => {
            const isExpanded = !!expandedOrders[order.id];
            
            // Count total item units inside the order
            const itemsCount = order.items.reduce((total, i) => total + i.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                id={`history-row-card-${order.id}`}
              >
                
                {/* Header Row clickable bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/30 transition-colors"
                  id={`history-row-trigger-${order.id}`}
                >
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2 flex-grow">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Order ID</p>
                      <p className="text-sm font-extrabold text-indigo-950 font-mono">{order.id}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Date Placed</p>
                      <p className="text-xs font-semibold text-gray-800">{order.date}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Payment Method</p>
                      <p className="text-xs font-semibold text-gray-700">{order.payment_method}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Total Bill</p>
                      <p className="text-sm font-extrabold text-indigo-950">${order.total_price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Accompany status details */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-gray-50 sm:border-none pt-3 sm:pt-0 shrink-0">
                    <div>{getStatusBadge(order.status)}</div>
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                </div>

                {/* Expanded Details fold */}
                {isExpanded && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-5 md:p-6 space-y-6 animate-fade-in" id={`history-row-expanded-${order.id}`}>
                    
                    {/* Item lines list */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2">Order Items ({itemsCount} units)</p>
                      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-150 overflow-hidden shadow-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="p-3.5 flex items-center gap-4">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs font-bold text-gray-900 truncate">{item.name}</h4>
                              <p className="text-[10px] text-gray-400">Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                            <span className="text-xs font-extrabold text-indigo-950 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address cards summary */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3.5 shadow-xs">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-50 pb-1.5 leading-none">Shipping & Delivery Details</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3.5 gap-x-6 text-xs">
                        <div>
                          <p className="text-gray-400 mb-0.5">Recipient</p>
                          <p className="font-semibold text-gray-900">{order.shipping_details.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-0.5">Contact Email</p>
                          <p className="font-semibold text-gray-900">{order.shipping_details.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-0.5">Contact Phone</p>
                          <p className="font-semibold text-gray-900">{order.shipping_details.phone}</p>
                        </div>
                        <div className="sm:col-span-2 md:col-span-3">
                          <p className="text-gray-400 mb-0.5">Destination Address</p>
                          <p className="font-semibold text-gray-900">{order.shipping_details.address}, {order.shipping_details.city}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
