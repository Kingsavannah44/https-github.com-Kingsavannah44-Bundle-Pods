import { useState, FormEvent } from 'react';
import { Product, Review } from '../types';
import { X, Star, Check, Sparkles, Send, Plus, Minus, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color: string) => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

const colors = [
  { name: 'Classic Slate', hex: '#334155' },
  { name: 'Frost White', hex: '#f8fafc' },
  { name: 'Ocean Teal', hex: '#0f766e' },
];

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  reviews,
  onAddReview
}: ProductDetailsModalProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'reviews'>('features');
  
  // New review form states
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) return;

    onAddReview({
      productId: product.id,
      userName: reviewerName,
      rating: reviewerRating,
      comment: reviewerComment,
    });

    setReviewerName('');
    setReviewerRating(5);
    setReviewerComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="relative bg-white rounded-none w-full max-w-4xl max-h-[90vh] overflow-hidden border border-black/15 shadow-2xl flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white border border-black/10 hover:bg-black/5 text-[#111111] rounded-none transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Gallery */}
        <div className="w-full md:w-1/2 bg-[#FAF9F6] p-6 flex flex-col justify-between border-r border-black/10">
          <div className="flex-grow flex items-center justify-center min-h-[250px] py-8">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-[300px] object-cover rounded-none border border-black/5 shadow-xs"
            />
          </div>

          <div className="mt-4">
            <span className="text-[9px] uppercase tracking-[0.2em] text-black/40 font-bold block mb-2">Select Color Colorway</span>
            <div className="flex gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`relative p-0.5 rounded-none border transition-all cursor-pointer ${
                    selectedColor === c.name ? 'border-black scale-105' : 'border-black/10'
                  }`}
                >
                  <span
                    className="block w-6 h-6 rounded-none border border-black/5"
                    style={{ backgroundColor: c.hex }}
                  />
                  {selectedColor === c.name && (
                    <span className="absolute -top-1 -right-1 bg-black text-white rounded-none p-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-black/50 mt-2 block font-serif italic">
              Active colorway: <strong className="text-[#111111] font-bold">{selectedColor}</strong>
            </span>
          </div>
        </div>

        {/* Right Side: details & reviews */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between max-h-[90vh] md:max-h-none bg-white">
          <div>
            <span className="text-[9px] font-bold text-black/40 uppercase tracking-[0.3em]">{product.category} Series</span>
            <h2 className="font-serif italic font-light text-2xl md:text-3xl text-neutral-900 mt-1 mb-2">
              {product.name}
            </h2>

            {/* Ratings & Star Breakdown */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-black">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-black/10'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#111111] font-mono">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-black/10">|</span>
              <span className="text-[10px] text-black/40 font-bold uppercase tracking-wider">
                {productReviews.length + product.reviewsCount} verified purchases
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-serif text-[#111111] font-medium">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-black/30 line-through font-mono">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 rounded-none uppercase tracking-widest">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-black/70 text-xs font-serif italic leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Navigation Tabs */}
            <div className="flex border-b border-black/10 mb-4">
              {(['features', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-4 text-[9px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'border-black text-black'
                      : 'border-transparent text-black/30 hover:text-black/60'
                  }`}
                >
                  {tab === 'specs' ? 'Specs' : tab === 'features' ? 'Features' : `Reviews (${productReviews.length})`}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[160px] mb-6">
              {activeTab === 'features' && (
                <ul className="space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-black/70 font-serif italic">
                      <Sparkles className="w-3.5 h-3.5 text-black/40 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex py-2 border-b border-black/5 last:border-0 justify-between">
                      <span className="text-black/40 font-bold uppercase tracking-wider text-[8px]">{key}</span>
                      <span className="text-black font-serif italic">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {/* Reviews List */}
                  <div className="max-h-[180px] overflow-y-auto space-y-3 pr-1">
                    {productReviews.length === 0 ? (
                      <p className="text-xs text-black/40 italic font-serif">No customer reviews yet. Be the first to share your experience!</p>
                    ) : (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="bg-[#FAF9F6] p-3 rounded-none border border-black/5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-black">{rev.userName}</span>
                            <span className="text-[9px] text-black/40 font-mono">{rev.date}</span>
                          </div>
                          <div className="flex text-black mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-black/10'}`}
                              />
                            ))}
                          </div>
                          <p className="text-black/70 font-serif italic text-[11px] leading-relaxed">{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="bg-[#FAF9F6] p-4 rounded-none border border-black/10">
                    <h4 className="text-[9px] font-bold text-black/40 uppercase tracking-[0.2em] mb-3">Write a Review</h4>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="p-2.5 bg-white text-xs border border-black/10 rounded-none focus:outline-none focus:border-black"
                        required
                      />
                      <div className="flex items-center justify-between bg-white px-2 border border-black/10 rounded-none">
                        <span className="text-[9px] text-black/40 uppercase font-bold tracking-wider">Rating:</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewerRating(star)}
                              className="p-0.5 text-black focus:outline-none cursor-pointer"
                            >
                              <Star className={`w-3.5 h-3.5 ${star <= reviewerRating ? 'fill-current' : 'text-black/10'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <textarea
                      placeholder="Share your thoughts about this pod..."
                      value={reviewerComment}
                      onChange={(e) => setReviewerComment(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-white text-xs border border-black/10 rounded-none focus:outline-none focus:border-black mb-2 resize-none"
                      required
                    />

                    <div className="flex justify-between items-center">
                      <AnimatePresence>
                        {reviewSuccess && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider"
                          >
                            Review submitted! Thank you.
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <button
                        type="submit"
                        className="ml-auto py-2 px-4 bg-black hover:bg-zinc-850 text-white rounded-none text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Footer Actions */}
          <div className="border-t border-black/10 pt-5 mt-auto flex items-center justify-between gap-4 bg-white">
            <div className="flex items-center border border-black/10 rounded-none bg-[#FAF9F6] px-2">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 hover:bg-black/5 text-[#111111] rounded-none transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-[#111111]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 hover:bg-black/5 text-[#111111] rounded-none transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              id={`modal-add-to-cart-${product.id}`}
              type="button"
              onClick={() => {
                onAddToCart(product, quantity, selectedColor);
                onClose();
              }}
              className="flex-grow py-4 px-6 bg-black hover:bg-zinc-850 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-none transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Add to Bag • ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
