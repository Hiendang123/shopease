import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, ArrowRight, CheckCircle, ShieldAlert, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setCurrentPage,
    products
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Reset quantity whenever selected product switches
  useEffect(() => {
    setQuantity(1);
    setIsLiked(false);
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stock_quantity <= 0;

  const handleIncrement = () => {
    if (quantity < selectedProduct.stock_quantity) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setCurrentPage('checkout');
  };

  // Find related products (from same category, excluding the active one)
  const relatedProducts = products
    .filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  // Draw star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4 text-amber-400">
            <Star className="absolute top-0 left-0 w-4 h-4 text-gray-200" />
            <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-200" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto flex items-stretch md:items-center justify-center p-0 md:p-6 backdrop-blur-xs" id="product-detail-modal-root">
      
      {/* Container card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white w-full max-w-5xl rounded-none md:rounded-3xl shadow-2xl relative flex flex-col md:max-h-[90vh] overflow-y-auto border border-gray-100"
        id="product-detail-card"
      >
        
        {/* Back and Close buttons */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md md:absolute md:top-6 md:left-6 z-20 px-4 py-3 md:p-0 flex items-center justify-between pointer-events-none w-full max-w-5xl">
          <button
            onClick={() => setSelectedProduct(null)}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 shadow-sm border border-gray-100 transition-all cursor-pointer"
            id="btn-back-to-shop"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </button>

          <button
            onClick={() => setSelectedProduct(null)}
            className="pointer-events-auto md:hidden w-8 h-8 rounded-full bg-white text-gray-500 hover:text-gray-900 shadow-sm border border-gray-100 flex items-center justify-center cursor-pointer"
            id="btn-close-detail-mobile"
          >
            X
          </button>
        </div>

        {/* Interior layout body */}
        <div className="p-4 sm:p-6 md:p-10 flex-grow md:overflow-y-auto" id="product-detail-layout-interior">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Block - Big Art Image */}
            <div className="space-y-4" id="detail-visual-column">
              <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group">
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  id="img-detail-main"
                />

                {/* Like Button */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`absolute top-4 right-4 p-2.5 rounded-xl border shadow-sm transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-50 border-rose-100 text-rose-500'
                      : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600'
                  }`}
                  id="btn-product-detail-like"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Right Block - Descriptive Controls */}
            <div className="flex flex-col justify-between py-2 space-y-6" id="detail-text-column">
              <div className="space-y-4">
                
                {/* Category & Stock statuses */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest" id="detail-cat-badge">
                    {selectedProduct.category}
                  </span>

                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100" id="detail-badge-soldout">
                      <ShieldAlert className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100" id="detail-badge-instock">
                      <CheckCircle className="w-3.5 h-3.5" /> In-Stock ({selectedProduct.stock_quantity})
                    </span>
                  )}
                </div>

                {/* Headings names */}
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight" id="detail-name">
                  {selectedProduct.name}
                </h2>

                {/* Price point box */}
                <div className="text-3xl font-black text-indigo-950" id="detail-price">
                  ${selectedProduct.price.toFixed(2)}
                </div>

                {/* Stars ratings */}
                <div className="flex items-center gap-2" id="detail-rating-row">
                  <div className="flex items-center gap-0.5">
                    {renderStars(selectedProduct.rating)}
                  </div>
                  <span className="text-xs font-bold text-gray-900">{selectedProduct.rating}</span>
                  <span className="text-xs text-gray-400">({selectedProduct.rating_count} customer reviews)</span>
                </div>

                {/* HR split */}
                <div className="border-t border-gray-150 pt-4">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-sans" id="detail-description-para">
                    {selectedProduct.description}
                  </p>
                </div>

              </div>

              {/* Add to Cart checkout panels */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {!isOutOfStock && (
                  <div className="flex items-center justify-between gap-4" id="detail-quantity-box">
                    <span className="text-sm font-semibold text-gray-700">Select Quantity</span>
                    
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        className="p-2.5 text-gray-500 hover:text-indigo-600 disabled:opacity-20 transition-colors"
                        id="btn-detail-qty-minus"
                        aria-label="Decrease item count"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-5 text-sm font-extrabold text-gray-900 min-w-[40px] text-center" id="detail-qty-counter">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= selectedProduct.stock_quantity}
                        className="p-2.5 text-gray-500 hover:text-indigo-600 disabled:opacity-20 transition-colors"
                        id="btn-detail-qty-plus"
                        aria-label="Increase item count"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary dynamic actions buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="detail-action-buttons">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                      isOutOfStock
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700 shadow-indigo-100'
                    }`}
                    id="btn-detail-add-cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-lg shadow-indigo-100'
                    }`}
                    id="btn-detail-buynow"
                  >
                    <span>Buy It Now</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Related row products catalog */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-8 mt-10" id="detail-related-section">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1.5 mb-6">
                Related Products <ArrowRight className="w-4 h-4 text-indigo-600" />
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="detail-related-grid">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="group cursor-pointer bg-white border border-gray-100 rounded-xl p-3 hover:shadow-lg transition-all"
                    id={`related-card-${p.id}`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-50 mb-3" id={`related-img-box-${p.id}`}>
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        id={`related-img-${p.id}`}
                      />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 truncate leading-snug group-hover:text-indigo-600 transition-colors" id={`related-title-${p.id}`}>
                      {p.name}
                    </h4>
                    <p className="text-xs font-extrabold text-indigo-950 mt-1" id={`related-price-${p.id}`}>
                      ${p.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
