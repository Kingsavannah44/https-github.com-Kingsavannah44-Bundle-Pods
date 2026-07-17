import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  
  // Calculate pricing metrics
  const itemCounts = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    if (item.type === 'product' && item.product) {
      return acc + item.product.price * item.quantity;
    } else if (item.type === 'bundle' && item.bundle) {
      return acc + item.bundle.price * item.quantity;
    } else if (item.type === 'custom_bundle') {
      // Find custom bundle price by multiplying items * quantity (discount is pre-factored in custom bundle price)
      const bundlePrice = item.bundle?.price || 0;
      return acc + bundlePrice * item.quantity;
    }
    return acc;
  }, 0);

  const shipping = subtotal > 75 ? 0 : subtotal === 0 ? 0 : 5.99;
  const estimatedTax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shipping + estimatedTax;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
        >
          {/* Header */}
          <div className="p-6 border-b border-black/10 flex justify-between items-center bg-[#FAF9F6]">
            <div className="flex items-center gap-2.5">
              <div>
                <h2 className="font-serif italic font-light text-2xl text-[#111111]">Your Bag //</h2>
                <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold">{itemCounts} curated items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 text-[#111111] rounded-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            <AnimatePresence initial={false}>
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center p-4"
                >
                  <div className="w-16 h-16 bg-[#FAF9F6] rounded-none flex items-center justify-center text-black/20 mb-4 border border-black/10">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif italic font-light text-xl text-[#111111]">Your cart is empty</h3>
                  <p className="text-xs text-neutral-400 font-serif italic max-w-[240px] mt-2 leading-relaxed">
                    Explore our modular collection and premium bundles to fill your pod pack!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 py-3.5 px-6 bg-[#111111] hover:bg-zinc-800 text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-none transition-all cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </motion.div>
              ) : (
                cart.map((item) => {
                  let id = item.id;
                  let title = '';
                  let subtitle = '';
                  let price = 0;
                  let image = '';
                  let isCustom = item.type === 'custom_bundle';

                  if (item.type === 'product' && item.product) {
                    title = item.product.name;
                    subtitle = `Colorway: ${item.selectedColor || 'Classic Slate'}`;
                    price = item.product.price;
                    image = item.product.image;
                  } else if (item.type === 'bundle' && item.bundle) {
                    title = item.bundle.name;
                    subtitle = `Includes ${item.bundle.products.length} essential pods (Savings ${item.bundle.discountPercentage}%)`;
                    price = item.bundle.price;
                    image = item.bundle.image;
                  } else if (item.type === 'custom_bundle' && item.bundle) {
                    title = item.bundle.name;
                    subtitle = `User Bundle: ${item.customBundleProducts?.map(p => p.name).join(', ')}`;
                    price = item.bundle.price;
                    image = item.customBundleProducts?.[0]?.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80';
                  }

                  return (
                    <motion.div
                      key={id}
                      id={`cart-item-${id}`}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 p-4 rounded-none bg-[#FAF9F6] border border-black/5 hover:border-black/15 transition-all relative overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-none bg-white overflow-hidden shrink-0 border border-black/5">
                        <img 
                          src={image} 
                          alt={title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pr-6">
                        {isCustom && (
                          <span className="text-[8px] uppercase font-bold bg-black text-white px-2 py-0.5 tracking-widest inline-block mb-1.5">
                            Bespoke Pack
                          </span>
                        )}
                        <h4 className="font-serif italic font-light text-sm text-[#111111] leading-tight block truncate">
                          {title}
                        </h4>
                        <p className="text-[10px] text-black/40 mt-0.5 block truncate">
                          {subtitle}
                        </p>

                        <div className="flex justify-between items-center mt-3">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-black/10 rounded-none bg-white scale-90 -ml-1">
                            <button
                              onClick={() => onUpdateQuantity(id, -1)}
                              className="p-1.5 hover:bg-zinc-100 text-black/50 rounded-none transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-[10px] font-bold text-black font-mono">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(id, 1)}
                              className="p-1.5 hover:bg-zinc-100 text-black/50 rounded-none transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <span className="text-xs font-medium font-serif text-black">
                            ${(price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Trash action button */}
                      <button
                        onClick={() => onRemoveItem(id)}
                        className="absolute right-3 top-3 p-1.5 text-black/30 hover:text-black hover:bg-black/5 rounded-none opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Summary and Action Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-black/10 bg-[#FAF9F6] space-y-4">
              <div className="space-y-2 text-xs text-black/60">
                <div className="flex justify-between">
                  <span className="font-serif italic">Subtotal</span>
                  <span className="font-semibold text-black font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-serif italic">Shipping</span>
                  <span className="font-semibold text-black">
                    {shipping === 0 ? <strong className="text-emerald-700 font-serif italic">FREE</strong> : <span className="font-mono">${shipping.toFixed(2)}</span>}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-serif italic">Estimated Tax (8%)</span>
                  <span className="font-semibold text-black font-mono">${estimatedTax.toFixed(2)}</span>
                </div>
                
                {subtotal < 75 && (
                  <div className="p-3 bg-black/5 border border-black/5 rounded-none text-[10px] text-black/60 tracking-wider uppercase font-bold mt-2">
                    Add <span className="text-black font-extrabold">${(75 - subtotal).toFixed(2)}</span> more for <strong>FREE SHIPPING</strong>!
                  </div>
                )}
              </div>

              <div className="border-t border-black/10 pt-4 flex justify-between items-baseline">
                <span className="text-[10px] uppercase font-bold tracking-widest text-black/40">Total Amount</span>
                <span className="font-serif text-xl text-[#111111] font-medium font-mono">${total.toFixed(2)}</span>
              </div>

              <button
                id="cart-drawer-checkout-btn"
                onClick={onCheckout}
                className="w-full py-4 px-4 bg-black hover:bg-zinc-850 text-white rounded-none font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
