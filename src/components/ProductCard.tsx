import { Product } from '../types';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onBuyNow: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onViewDetails
}: ProductCardProps) {
  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-white rounded-none overflow-hidden p-6 border border-black/5 hover:border-black/20 transition-all duration-300"
    >
      {/* Category Badge & Tags */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1">
          {product.isNew && (
            <span className="text-[9px] uppercase font-bold tracking-widest bg-black text-white px-2.5 py-1 rounded-none">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="text-[9px] uppercase font-bold tracking-widest bg-[#8C8C88] text-white px-2.5 py-1 rounded-none">
              Elite Selection
            </span>
          )}
        </div>
        <span className="text-[9px] uppercase tracking-widest text-[#111111]/40 bg-black/5 px-2.5 py-1 rounded-none font-bold">
          {product.category}
        </span>
      </div>

      {/* Product Image Panel */}
      <div className="relative aspect-square w-full rounded-none overflow-hidden bg-neutral-50 flex items-center justify-center mb-5 cursor-pointer border border-black/5" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick View Button */}
        <div className="absolute inset-0 bg-[#FAF9F6]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="py-3 px-5 bg-white border border-black/15 text-neutral-800 text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm rounded-none hover:bg-zinc-50 transition-all duration-300 flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5 text-black/50" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <h3 
          className="font-serif italic font-light text-xl text-[#111111] hover:opacity-70 cursor-pointer line-clamp-1 mb-2 leading-none"
          onClick={() => onViewDetails(product)}
        >
          {product.name}
        </h3>

        {/* Rating Block */}
        <div className="flex items-center gap-1.5 mb-4 text-[10px] text-black/50 uppercase tracking-wider font-bold">
          <div className="flex items-center text-black">
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="font-bold text-neutral-800">{product.rating.toFixed(1)}</span>
          <span className="text-[9px] text-black/30">({product.reviewsCount} critiques)</span>
        </div>

        {/* Price & Actions Row */}
        <div className="mt-auto pt-2 border-t border-black/5">
          <div className="flex justify-between items-baseline mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif text-[#111111] font-medium">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through font-mono">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id={`add-to-cart-btn-${product.id}`}
              type="button"
              onClick={() => onAddToCart(product, 1)}
              className="py-3 px-2 bg-white hover:bg-neutral-50 text-[#111111] font-bold text-[10px] uppercase tracking-[0.15em] border border-black/10 rounded-none transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
            >
              Add To Bag
            </button>
            <button
              id={`buy-now-btn-${product.id}`}
              type="button"
              onClick={() => onBuyNow(product)}
              className="py-3 px-2 bg-black hover:bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-[0.15em] rounded-none transition-colors duration-200 cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
