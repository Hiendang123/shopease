import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { CreditCard, Banknote, ShieldCheck, Mail, Phone, User, MapPin, Building, ArrowLeft } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    currentUser,
    placeOrder,
    setCurrentPage,
    addToast
  } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Cash on Delivery'>('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepopulate if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.full_name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Handle Order Placement
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !address || !city) {
      addToast('Please fill out all shipping details.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder(
        { name, email, phone, address, city },
        paymentMethod
      );
    } catch (err) {
      addToast('Order placement failed. Check details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 50.0 ? 0 : 5.99;
  const grandTotal = subtotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-4" id="checkout-no-items">
        <h2 className="text-xl font-bold text-gray-900">No active items for checkout</h2>
        <p className="text-gray-500 text-xs">Add items to your cart before proceeding with checkout.</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 cursor-pointer"
          id="btn-checkout-home"
        >
          Browse Shop Product Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" id="checkout-view-root">
      
      {/* Title Header split */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5 mb-8" id="checkout-header">
        <button
          onClick={() => setCurrentPage('cart')}
          className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-100 cursor-pointer bg-white"
          id="btn-checkout-back-cart"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight font-sans">Checkout Shipping</h1>
          <p className="text-xs text-gray-400">Specify details and lock in secure payment</p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="checkout-grid-layout">
        
        {/* Left Column Form panel */}
        <div className="lg:col-span-7 space-y-6" id="checkout-form-column">
          
          {/* Shipping Form fields cards */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-5" id="shipping-details-card">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3 mb-2">
              <span>1. Customer Address Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 md:col-span-2" id="checkout-field-fullname">
                <label className="text-xs font-semibold text-gray-600 pl-1 block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-gray-50/50 text-gray-900 font-medium"
                    id="input-shipping-name"
                  />
                </div>
              </div>

              {/* Email address */}
              <div className="space-y-1.5" id="checkout-field-email">
                <label className="text-xs font-semibold text-gray-600 pl-1 block">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400"><Mail className="w-4 h-4" /></span>
                  <input
                    type="email"
                    required
                    placeholder="name@destination.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-gray-50/50 text-gray-900 font-medium"
                    id="input-shipping-email"
                  />
                </div>
              </div>

              {/* Phone number */}
              <div className="space-y-1.5" id="checkout-field-phone">
                <label className="text-xs font-semibold text-gray-600 pl-1 block">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400"><Phone className="w-4 h-4" /></span>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 0192-230"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-gray-50/50 text-gray-900 font-medium"
                    id="input-shipping-phone"
                  />
                </div>
              </div>

              {/* Shipping address */}
              <div className="space-y-1.5 md:col-span-2" id="checkout-field-address">
                <label className="text-xs font-semibold text-gray-600 pl-1 block">Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400"><MapPin className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="Street name, suite, or apartment number"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-gray-50/50 text-gray-900 font-medium"
                    id="input-shipping-address"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5 md:col-span-2" id="checkout-field-city">
                <label className="text-xs font-semibold text-gray-600 pl-1 block">City</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400"><Building className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="New York, Paris, Tokyo"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow bg-gray-50/50 text-gray-900 font-medium"
                    id="input-shipping-city"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Secure Payment Options */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 space-y-4" id="checkout-payment-card">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
              <span>2. Secure Payment Gateway</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1" id="payment-toggles-options">
              {/* Credit Card option */}
              <label
                onClick={() => setPaymentMethod('Credit Card')}
                className={`border rounded-xl p-4 flex gap-3 items-center cursor-pointer transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-indigo-500 bg-indigo-50/10'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                }`}
                id="label-pay-cc"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={paymentMethod === 'Credit Card'}
                  onChange={() => {}} // synthetic change
                  className="accent-indigo-600 h-4 w-4 shrink-0"
                />
                <div className="flex items-center gap-2 text-gray-700">
                  <CreditCard className="w-4 h-4 text-indigo-500" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-gray-400">Visa, Mastercard, AMEX</p>
                  </div>
                </div>
              </label>

              {/* COD cash option */}
              <label
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`border rounded-xl p-4 flex gap-3 items-center cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-indigo-500 bg-indigo-50/10'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                }`}
                id="label-pay-cod"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => {}}
                  className="accent-indigo-600 h-4 w-4 shrink-0"
                />
                <div className="flex items-center gap-2 text-gray-700">
                  <Banknote className="w-4 h-4 text-indigo-500" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-[10px] text-gray-400">Pay when shipped directly</p>
                  </div>
                </div>
              </label>
            </div>
            
            {paymentMethod === 'Credit Card' && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in" id="mock-cc-fields">
                <div className="sm:col-span-3 text-[11px] text-indigo-600 font-semibold bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100">
                  🛠️ Sandbox Mode: Fake card numbers or dummy characters are fully accepted for this demo simulation!
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 pl-1 upper block">Card Number</label>
                  <input
                    type="text"
                    required={paymentMethod === 'Credit Card'}
                    placeholder="•••• •••• •••• 4242"
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 pl-1 upper block">Expiry Date</label>
                  <input
                    type="text"
                    required={paymentMethod === 'Credit Card'}
                    placeholder="MM/YY"
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column Checkout order summaries */}
        <div className="lg:col-span-5 space-y-4" id="checkout-summary-column">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5 sticky top-28" id="checkout-totals-card">
            <h3 className="text-base font-extrabold text-gray-900 border-b border-gray-50 pb-3">Compact Order Summary</h3>

            {/* List mini line items */}
            <div className="divide-y divide-gray-100 overflow-y-auto max-h-[220px] pr-1" id="checkout-mini-list">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center gap-3" id={`checkout-lines-${product.id}`}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-400">Qty: {quantity} × ${product.price.toFixed(2)}</p>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 shrink-0">${(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Balance figures */}
            <div className="space-y-3 pt-3 border-t border-gray-100" id="checkout-breakdown-digits">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-extrabold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Grand Total</span>
                <span className="text-xl font-extrabold text-indigo-950" id="checkout-grand-total">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Form placement place order trigger button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all cursor-pointer shadow-lg shadow-indigo-100 disabled:opacity-50"
              id="btn-place-order"
            >
              {isSubmitting ? 'Processing Transaction...' : 'Place My Order Now'}
            </button>

            {/* Shield tag secure */}
            <div className="flex items-center gap-1.5 justify-center text-[10px] text-gray-400" id="checkout-secure-footer">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Full PCI security compliance verified by Shopify partners</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
