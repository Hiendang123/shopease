import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, Percent, Lock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useShop();

  // Draw star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" id={`star-${product.id}-${i}`} />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-3.5 h-3.5 text-amber-400" id={`half-star-wrap-${product.id}`}>
            <Star className="absolute top-0 left-0 w-3.5 h-3.5 text-gray-200" />
            <div className="absolute top-0 left-0 w-[50%] overflow-hidden">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 text-gray-200" id={`empty-star-${product.id}-${i}`} />
        );
      }
    }
    return stars;
  };

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer hover:shadow-md hover:border-indigo-250 transition-all duration-300 md:hover:-translate-y-1 group"
      id={`product-card-${product.id}`}
    >
      {/* Product Image and Badge */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-2xl mb-4 flex items-center justify-center" id={`img-container-${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          id={`product-img-${product.id}`}
        />

        {/* Category sticker */}
        <span
          className="absolute top-2 left-2 px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white shadow-sm rounded-lg uppercase tracking-wide border border-slate-100"
          id={`badge-cat-${product.id}`}
        >
          {product.category}
        </span>

        {/* Dynamic stock flags */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-900/60 rounded-2xl backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-1" id={`tag-sold-out-${product.id}`}>
            <Lock className="w-3.5 h-3.5" /> Sold Out
          </div>
        ) : product.stock_quantity <= 5 ? (
          <span
            className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-md"
            id={`tag-low-stock-${product.id}`}
          >
            Only {product.stock_quantity} left
          </span>
        ) : null}
      </div>

      {/* Narrative Section */}
      <div className="flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2" id={`meta-row-${product.id}`}>
            <h3
              className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors"
              id={`product-title-${product.id}`}
            >
              {product.name}
            </h3>
            <span className="text-indigo-600 font-extrabold text-sm shrink-0" id={`price-${product.id}`}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5" id={`rating-row-${product.id}`}>
            <div className="flex items-center gap-0.5">{renderStars(product.rating)}</div>
            <span className="text-[10px] font-medium text-slate-400 font-sans" id={`rating-val-${product.id}`}>({product.rating_count} reviews)</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent opening detailed modal
            addToCart(product);
          }}
          disabled={isOutOfStock}
          className={`mt-auto w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transitions-colors transition-all flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-indigo-600 cursor-pointer shadow-lg shadow-slate-100'
          }`}
          id={`btn-add-to-cart-box-${product.id}`}
          title="Add to shopping cart"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
