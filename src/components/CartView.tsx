import React from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    setCurrentPage,
    addToast
  } = useShop();

  const handleBackToShop = () => {
    setCurrentPage('home');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      addToast('Your cart is empty. Please add items before checking out.', 'error');
      return;
    }
    setCurrentPage('checkout');
  };

  // Calculate prices
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFeeThreshold = 50.0;
  const shippingFeePrice = subtotal > shippingFeeThreshold ? 0 : 5.99;
  const totalBalance = subtotal + shippingFeePrice;
  const deltaToFreeShipping = shippingFeeThreshold - subtotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 md:py-20 px-4 flex flex-col items-center gap-6" id="cart-empty-state-root">
        <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 font-sans tracking-tight" id="cart-empty-title">Your Cart is Empty</h2>
          <p className="text-sm text-gray-500 max-w-sm leading-relaxed" id="cart-empty-subtext">
            Looks like you haven't added anything to your cart yet. Browse our exclusive catalog and discover something original today!
          </p>
        </div>
        <button
          onClick={handleBackToShop}
          className="px-6 py-3 bg-indigo-600 font-bold text-white rounded-xl hover:bg-indigo-500 transition-colors cursor-pointer inline-flex items-center gap-2"
          id="btn-cart-empty-shop"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shpping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" id="cart-view-root">
      
      {/* Header page title */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8" id="cart-view-header">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Shopping Bag</h1>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-extrabold px-2.5 py-1 rounded-full border border-indigo-100">
            {cart.reduce((qty, p) => qty + p.quantity, 0)} Items
          </span>
        </div>

        <button
          onClick={handleBackToShop}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer bg-white"
          id="btn-cart-continue-shopping"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </button>
      </div>

      {/* Progress to Free Shipping Bar */}
      {deltaToFreeShipping > 0 ? (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-8 flex flex-col gap-2" id="free-shipping-progress">
          <p className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5 pl-1">
            <span>You are <span className="font-extrabold">${deltaToFreeShipping.toFixed(2)}</span> away from <span className="font-extrabold">FREE shipping</span>!</span>
          </p>
          <div className="h-2 bg-indigo-100/60 rounded-full w-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / shippingFeeThreshold) * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-8 text-emerald-900 text-xs font-semibold flex items-center gap-2 pl-5" id="free-shipping-unlocked">
          🎉 Congratulations! Your order qualifies for <span className="font-extrabold text-emerald-950">FREE shipping</span>.
        </div>
      )}

      {/* Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="cart-cols-grid">
        
        {/* Left Column - List view of products */}
        <div className="lg:col-span-2 space-y-4" id="cart-items-column">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-slate-150 p-5 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-all duration-300"
              id={`cart-item-row-${product.id}`}
            >
              {/* Product Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                  id={`cart-item-img-${product.id}`}
                />
              </div>

              {/* Middle Section - Title and controls */}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                
                {/* Details summary text */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider leading-none inline-block mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 leading-tight truncate max-w-xs pr-2" id={`cart-item-title-${product.id}`}>
                    {product.name}
                  </h3>
                  <p className="text-xs font-extrabold text-indigo-600 block pt-0.5" id={`cart-item-price-${product.id}`}>
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Interactive controller incrementers inline */}
                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-start" id={`cart-item-actions-${product.id}`}>
                  
                  {/* Quantity adjustment buttons */}
                  <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="p-2 hover:bg-slate-100 hover:text-indigo-600 transition-colors text-slate-500 cursor-pointer"
                      id={`btn-cartitem-minus-${product.id}`}
                      aria-label="Decrease item quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800 min-w-[28px] text-center" id={`cartitem-qty-${product.id}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="p-2 hover:bg-slate-100 hover:text-indigo-600 transition-colors text-slate-500 cursor-pointer"
                      id={`btn-cartitem-plus-${product.id}`}
                      aria-label="Increase item quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Calculated Sub balance */}
                  <span className="text-sm font-black text-slate-800 min-w-[70px] text-right" id={`cartitem-subtotal-${product.id}`}>
                    ${(product.price * quantity).toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-550 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
                    id={`btn-cartitem-remove-${product.id}`}
                    title="Remove item"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Column - Payment Summary Card */}
        <div className="space-y-4" id="cart-sidebar-column">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col gap-6" id="cart-balances-card">
            <h3 className="text-base font-extrabold text-slate-850 border-b border-slate-100 pb-3">Order Summary</h3>

            <div className="space-y-3.5" id="cart-breakdown-box">
              <div className="flex justify-between items-center text-sm text-slate-550">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800" id="cart-breakdown-subtotal">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm text-slate-550">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-850" id="cart-breakdown-shipping">
                  {shippingFeePrice === 0 ? (
                    <span className="text-emerald-500 font-bold uppercase text-[10px] bg-emerald-50 px-2.5 py-1 rounded-md">FREE</span>
                  ) : (
                    `$${shippingFeePrice.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3.5 flex justify-between items-center">
                <span className="text-base font-black text-slate-800">Total Price</span>
                <span className="text-xl font-black text-indigo-600" id="cart-breakdown-total">${totalBalance.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkouts CTA buttons */}
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-4 shadow-xl shadow-indigo-100 hover:scale-[1.01] transition-transform cursor-pointer flex items-center justify-center gap-2"
              id="btn-cart-proceed-checkout"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Shield tag security disclaimer */}
            <div className="flex items-center gap-2 justify-center text-[10px] text-gray-400 pt-1" id="cart-securitybadge">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full buyer protection secured by 256-bit encryption</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
