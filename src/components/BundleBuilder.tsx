import { useState, useMemo } from 'react';
import { Product } from '../types';
import { Music, Zap, Shield, Plus, Check, Sparkles, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BundleBuilderProps {
  products: Product[];
  onAddCustomBundle: (products: Product[], bundleName: string, price: number) => void;
}

export default function BundleBuilder({ products, onAddCustomBundle }: BundleBuilderProps) {
  // Filter products by slots
  const audioPods = useMemo(() => products.filter((p) => p.category === 'Music'), [products]);
  const powerPods = useMemo(() => products.filter((p) => p.category === 'Storage' || p.category === 'Other' || p.category === 'Phone'), [products]);
  const shieldPods = useMemo(() => products.filter((p) => p.category === 'Storage' || p.category === 'Other' || p.category === 'Home'), [products]);

  const [selectedAudio, setSelectedAudio] = useState<Product | null>(products.find(p => p.id === 'buds-pod-pro') || null);
  const [selectedPower, setSelectedPower] = useState<Product | null>(products.find(p => p.id === 'charge-pod-dual') || null);
  const [selectedShield, setSelectedShield] = useState<Product | null>(products.find(p => p.id === 'armor-pod-case') || null);
  
  const [activeSlot, setActiveSlot] = useState<'audio' | 'power' | 'shield'>('audio');
  const [customName, setCustomName] = useState('My Custom Pod Pack');
  const [isAdded, setIsAdded] = useState(false);

  const activeProductsList = useMemo(() => {
    if (activeSlot === 'audio') return audioPods;
    if (activeSlot === 'power') return powerPods;
    return shieldPods;
  }, [activeSlot, audioPods, powerPods, shieldPods]);

  const isSelected = (product: Product) => {
    if (selectedAudio?.id === product.id) return true;
    if (selectedPower?.id === product.id) return true;
    if (selectedShield?.id === product.id) return true;
    return false;
  };

  const handleSelectProduct = (product: Product) => {
    if (activeSlot === 'audio') {
      setSelectedAudio(product);
    } else if (activeSlot === 'power') {
      setSelectedPower(product);
    } else {
      setSelectedShield(product);
    }
  };

  // Pricing calculations
  const originalTotal = useMemo(() => {
    let sum = 0;
    if (selectedAudio) sum += selectedAudio.price;
    if (selectedPower) sum += selectedPower.price;
    if (selectedShield) sum += selectedShield.price;
    return sum;
  }, [selectedAudio, selectedPower, selectedShield]);

  const discountRate = 0.15; // 15% discount for building a bundle
  const discountedPrice = useMemo(() => {
    return originalTotal * (1 - discountRate);
  }, [originalTotal]);

  const savings = useMemo(() => {
    return originalTotal * discountRate;
  }, [originalTotal]);

  const handleAddBundleToCart = () => {
    const selectedList: Product[] = [];
    if (selectedAudio) selectedList.push(selectedAudio);
    if (selectedPower) selectedList.push(selectedPower);
    if (selectedShield) selectedList.push(selectedShield);

    if (selectedList.length === 0) return;

    onAddCustomBundle(selectedList, customName || 'Custom Pod Pack', discountedPrice);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <section id="bundle-builder-studio" className="bg-[#FAF9F6] text-[#111111] rounded-none p-8 md:p-12 border border-black/10 overflow-hidden relative">
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-10 border-b border-black/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] uppercase tracking-[0.3em] font-black text-black/40 block">
                // Modular Audio System
              </span>
            </div>
            <h2 className="font-serif italic font-light text-3xl sm:text-4xl text-[#111111]">
              Bundle Builder Studio
            </h2>
            <p className="text-black/60 text-xs mt-2 max-w-xl font-serif italic leading-relaxed">
              Combine your perfect setup from three essential layers. Unlock an automatic <strong className="text-black font-bold">15% bundle discount</strong> on your bespoke pods combination.
            </p>
          </div>
          <div className="bg-white border border-black/15 rounded-none px-5 py-3 text-right shrink-0">
            <span className="text-[9px] text-black/40 block uppercase font-bold tracking-[0.2em]">Dynamic Discount</span>
            <span className="text-sm font-bold tracking-wider text-black">15% SAVINGS APPLIED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: 3 Slots Display */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-[#111111]/40 tracking-[0.3em] mb-4 block">Your Bundle Blueprint</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Slot 1: Audio Pod */}
              <button
                type="button"
                onClick={() => setActiveSlot('audio')}
                className={`flex flex-col items-center justify-center p-4 rounded-none border transition-all cursor-pointer relative h-[180px] w-full text-center ${
                  activeSlot === 'audio'
                    ? 'border-black bg-white shadow-[0_15px_30px_rgba(0,0,0,0.04)]'
                    : 'border-black/5 bg-white/40 hover:bg-white/80'
                }`}
              >
                <div className="absolute top-3 left-3 flex items-center gap-1 text-[8px] text-black/40 uppercase font-bold tracking-widest">
                  <Music className="w-2.5 h-2.5 text-black/40" />
                  Sound
                </div>
                {selectedAudio ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full pt-4"
                  >
                    <img
                      src={selectedAudio.image}
                      alt={selectedAudio.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-none mb-2 border border-black/5"
                    />
                    <span className="text-[11px] font-serif italic text-black block line-clamp-1">{selectedAudio.name}</span>
                    <span className="text-[10px] text-black/40 block font-mono">${selectedAudio.price.toFixed(2)}</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full pt-4">
                    <div className="w-8 h-8 rounded-none border border-black/10 flex items-center justify-center text-neutral-400 mb-2">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-400">Select Audio Pod</span>
                  </div>
                )}
              </button>

              {/* Slot 2: Power Pod */}
              <button
                type="button"
                onClick={() => setActiveSlot('power')}
                className={`flex flex-col items-center justify-center p-4 rounded-none border transition-all cursor-pointer relative h-[180px] w-full text-center ${
                  activeSlot === 'power'
                    ? 'border-black bg-white shadow-[0_15px_30px_rgba(0,0,0,0.04)]'
                    : 'border-black/5 bg-white/40 hover:bg-white/80'
                }`}
              >
                <div className="absolute top-3 left-3 flex items-center gap-1 text-[8px] text-black/40 uppercase font-bold tracking-widest">
                  <Zap className="w-2.5 h-2.5 text-black/40" />
                  Power/Phone
                </div>
                {selectedPower ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full pt-4"
                  >
                    <img
                      src={selectedPower.image}
                      alt={selectedPower.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-none mb-2 border border-black/5"
                    />
                    <span className="text-[11px] font-serif italic text-black block line-clamp-1">{selectedPower.name}</span>
                    <span className="text-[10px] text-black/40 block font-mono">${selectedPower.price.toFixed(2)}</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full pt-4">
                    <div className="w-8 h-8 rounded-none border border-black/10 flex items-center justify-center text-neutral-400 mb-2">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-400">Select Power Pod</span>
                  </div>
                )}
              </button>

              {/* Slot 3: Shield Pod */}
              <button
                type="button"
                onClick={() => setActiveSlot('shield')}
                className={`flex flex-col items-center justify-center p-4 rounded-none border transition-all cursor-pointer relative h-[180px] w-full text-center ${
                  activeSlot === 'shield'
                    ? 'border-black bg-white shadow-[0_15px_30px_rgba(0,0,0,0.04)]'
                    : 'border-black/5 bg-white/40 hover:bg-white/80'
                }`}
              >
                <div className="absolute top-3 left-3 flex items-center gap-1 text-[8px] text-black/40 uppercase font-bold tracking-widest">
                  <Shield className="w-2.5 h-2.5 text-black/40" />
                  Shield/Home
                </div>
                {selectedShield ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full pt-4"
                  >
                    <img
                      src={selectedShield.image}
                      alt={selectedShield.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-none mb-2 border border-black/5"
                    />
                    <span className="text-[11px] font-serif italic text-black block line-clamp-1">{selectedShield.name}</span>
                    <span className="text-[10px] text-black/40 block font-mono">${selectedShield.price.toFixed(2)}</span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full pt-4">
                    <div className="w-8 h-8 rounded-none border border-black/10 flex items-center justify-center text-neutral-400 mb-2">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-400">Select Shield Pod</span>
                  </div>
                )}
              </button>

            </div>

            {/* SELECTION TRAY: Horizontal list of items for active slot */}
            <div className="bg-white rounded-none p-5 border border-black/10 mt-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
                <span className="text-[9px] font-bold text-black/40 uppercase tracking-[0.2em]">
                  Available for {activeSlot === 'audio' ? 'Sound' : activeSlot === 'power' ? 'Power/Phone' : 'Shield/Home'} slot
                </span>
                <span className="text-[9px] uppercase tracking-wider text-black/30 font-bold">Click to Equip</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeProductsList.map((product) => {
                  const equipped = isSelected(product);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className={`p-3 rounded-none border flex items-center gap-3 transition-all cursor-pointer relative overflow-hidden ${
                        equipped
                          ? 'border-black bg-zinc-50'
                          : 'border-black/5 bg-[#FAF9F6] hover:border-black/15'
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-none shrink-0 border border-black/5"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-serif italic text-[#111111] block truncate">{product.name}</span>
                        <span className="text-[10px] text-black/40 block font-mono">${product.price.toFixed(2)}</span>
                      </div>

                      {equipped && (
                        <div className="absolute right-2 top-2 bg-black text-white rounded-none p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT: Pricing & Naming Summary Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-none border border-black/10 relative">
            <h3 className="text-[10px] uppercase font-bold text-black/40 tracking-[0.3em] mb-6">Pack Summary</h3>
            
            <div className="mb-6">
              <label htmlFor="bundle-name-input" className="text-[9px] uppercase font-bold tracking-[0.25em] text-black/40 block mb-2">
                Bespoke Bundle Name //
              </label>
              <input
                id="bundle-name-input"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="E.g., Audiophile Starter Pack"
                className="w-full bg-[#FAF9F6] text-xs font-serif italic text-black px-4 py-3 rounded-none border border-black/10 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="border-t border-black/10 my-4 pt-4 space-y-3 text-xs">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-black/50 uppercase tracking-wider text-[9px] font-bold">Sound Pod</span>
                <span className="font-serif italic text-[#111111] text-right truncate max-w-[180px]">
                  {selectedAudio ? `${selectedAudio.name}` : 'None selected'}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-black/50 uppercase tracking-wider text-[9px] font-bold">Power Pod</span>
                <span className="font-serif italic text-[#111111] text-right truncate max-w-[180px]">
                  {selectedPower ? `${selectedPower.name}` : 'None selected'}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-black/50 uppercase tracking-wider text-[9px] font-bold">Shield Pod</span>
                <span className="font-serif italic text-[#111111] text-right truncate max-w-[180px]">
                  {selectedShield ? `${selectedShield.name}` : 'None selected'}
                </span>
              </div>
              
              <div className="border-t border-black/5 my-2 pt-2" />

              <div className="flex justify-between text-black/50 text-[11px] font-serif italic">
                <span>Components Subtotal</span>
                <span className="font-mono">${originalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-serif italic text-[11px]">
                <span>Studio Discount (15% Off)</span>
                <span className="font-mono">-${savings.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-black/10 my-6 pt-6 flex justify-between items-baseline">
              <span className="text-[10px] uppercase font-bold tracking-widest text-black/40">Total Bundle Price</span>
              <div className="text-right">
                <span className="text-2xl font-serif text-[#111111] font-medium block">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600 block mt-1">Instant savings of ${savings.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="add-custom-bundle-to-cart-btn"
              type="button"
              disabled={!selectedAudio && !selectedPower && !selectedShield}
              onClick={handleAddBundleToCart}
              className={`w-full py-4 px-4 rounded-none font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAdded
                  ? 'bg-emerald-800 text-white'
                  : 'bg-black text-white hover:bg-zinc-850'
              }`}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Added Pack To Bag!
                  </motion.span>
                ) : (
                  <motion.span
                    key="normal"
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Equip Custom Bundle
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
