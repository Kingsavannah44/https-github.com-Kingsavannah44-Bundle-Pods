import { useState, FormEvent } from 'react';
import { CartItem } from '../types';
import { X, Check, CreditCard, ShieldCheck, Mail, MapPin, Truck, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onClearCart
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Shipping states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Generated info
  const [orderId] = useState(() => `BP-${Math.floor(Math.random() * 900000) + 100000}`);

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product?.price || item.bundle?.price || 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 75 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = () => {
    setStep(4);
    // Clear cart upon final order confirmation
    onClearCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        className="bg-white rounded-none w-full max-w-2xl max-h-[90vh] overflow-hidden border border-black/15 shadow-2xl flex flex-col relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-black/10 bg-[#FAF9F6] flex justify-between items-center">
          <div>
            <h2 className="font-serif italic font-light text-2xl text-[#111111]">Checkout //</h2>
            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold">Order ID: {orderId}</p>
          </div>
          {step < 4 && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 text-[#111111] rounded-none transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicators */}
        {step < 4 && (
          <div className="bg-[#FAF9F6]/50 py-3.5 px-6 border-b border-black/10 flex justify-between items-center text-[10px]">
            <div className="flex gap-2 items-center">
              <span className={`font-mono text-[9px] ${
                step >= 1 ? 'text-black font-bold' : 'text-black/30'
              }`}>[1]</span>
              <span className={`uppercase tracking-wider font-bold ${step === 1 ? 'text-black' : 'text-black/30'}`}>Shipping</span>
            </div>
            <div className="h-px bg-black/10 flex-1 mx-4" />
            <div className="flex gap-2 items-center">
              <span className={`font-mono text-[9px] ${
                step >= 2 ? 'text-black font-bold' : 'text-black/30'
              }`}>[2]</span>
              <span className={`uppercase tracking-wider font-bold ${step === 2 ? 'text-black' : 'text-black/30'}`}>Payment</span>
            </div>
            <div className="h-px bg-black/10 flex-1 mx-4" />
            <div className="flex gap-2 items-center">
              <span className={`font-mono text-[9px] ${
                step >= 3 ? 'text-black font-bold' : 'text-black/30'
              }`}>[3]</span>
              <span className={`uppercase tracking-wider font-bold ${step === 3 ? 'text-black' : 'text-black/30'}`}>Review</span>
            </div>
          </div>
        )}

        {/* Form area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleNextStep}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-[#111111] font-serif italic text-sm mb-4">
                  <MapPin className="w-4 h-4 text-black/50" />
                  <h3>Where should we ship your Pod Pack?</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g., Alexander Mercer"
                      required
                      className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E.g., alex@bundlepods.com"
                      required
                      className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">Delivery Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="E.g., 405 Sound Wave Boulevard"
                      required
                      className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="E.g., San Francisco"
                        required
                        className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">Zip/Postal Code</label>
                      <input
                        type="text"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        placeholder="E.g., 94105"
                        required
                        className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/10 flex justify-end">
                  <button
                    type="submit"
                    className="py-4 px-6 bg-black hover:bg-zinc-850 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Continue to Payment
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleNextStep}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 text-[#111111] font-serif italic text-sm mb-4">
                  <CreditCard className="w-4 h-4 text-black/50" />
                  <h3>Enter your secure billing card details</h3>
                </div>

                <div className="bg-[#111111] rounded-none p-6 text-white flex flex-col justify-between h-[150px] relative overflow-hidden mb-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold tracking-[0.25em] text-[#FAF9F6]/60 uppercase">BUNDLE PODS PREFERRED</span>
                    <span className="text-[8px] bg-white/10 text-[#FAF9F6] px-2 py-0.5 rounded-none font-bold uppercase tracking-widest">Slate Card</span>
                  </div>
                  <div className="font-mono text-base tracking-[0.15em] my-2 text-[#FAF9F6]/90">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[7px] text-[#FAF9F6]/40 block uppercase tracking-wider">Card Holder</span>
                      <span className="text-xs tracking-wide uppercase">{name || 'YOUR FULL NAME'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[7px] text-[#FAF9F6]/40 block uppercase tracking-wider">Expiry</span>
                      <span className="text-xs font-mono">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      placeholder="4000 1234 5678 9010"
                      required
                      className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">Expiration Date</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\//g, '');
                          if (val.length >= 2) {
                            setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
                          } else {
                            setCardExpiry(val);
                          }
                        }}
                        required
                        className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-[0.2em] text-black/40 block mb-1">CVV / Code</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                        className="w-full p-3 bg-[#FAF9F6] border border-black/10 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/10 flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] uppercase tracking-wider font-bold text-black/50 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Shipping
                  </button>
                  <button
                    type="submit"
                    className="py-4 px-6 bg-black hover:bg-zinc-850 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Review Order
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-[#111111] font-serif italic text-sm mb-2">
                  <ShieldCheck className="w-4 h-4 text-black/50" />
                  <h3>Review details and dispatch your order</h3>
                </div>

                {/* Shipping & Payment summary summaries */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF9F6] p-4 rounded-none border border-black/10 text-xs">
                  <div>
                    <span className="font-bold text-black/40 uppercase tracking-widest text-[8px] block mb-1.5">Shipping Destination</span>
                    <p className="font-bold text-black">{name}</p>
                    <p className="text-black/60 mt-0.5">{address}, {city}, {zip}</p>
                    <p className="text-black/60 mt-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 shrink-0" /> {email}
                    </p>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-black/10 pt-3 md:pt-0 md:pl-4">
                    <span className="font-bold text-black/40 uppercase tracking-widest text-[8px] block mb-1.5">Payment Method</span>
                    <p className="font-bold text-[#111111] flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-black/40" />
                      Card ending in {cardNumber.slice(-4) || '4000'}
                    </p>
                    <p className="text-black/50 mt-0.5">Authorization Secured</p>
                  </div>
                </div>

                {/* Items in basket */}
                <div>
                  <span className="font-bold text-black/40 uppercase tracking-widest text-[8px] block mb-2">Basket Overview</span>
                  <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1">
                    {cart.map((item) => {
                      const itemTitle = item.product?.name || item.bundle?.name || 'Bundle Pack';
                      const itemPrice = item.product?.price || item.bundle?.price || 0;
                      return (
                        <div key={item.id} className="flex justify-between items-center bg-[#FAF9F6] p-2.5 rounded-none border border-black/5 text-xs">
                          <span className="text-[#111111] font-serif italic block truncate max-w-[280px]">
                            {itemTitle} <strong className="text-black/30 font-mono">x{item.quantity}</strong>
                          </span>
                          <span className="font-medium text-black font-mono">${(itemPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-black/10 pt-4 space-y-2.5 text-xs text-black/60">
                  <div className="flex justify-between">
                    <span className="font-serif italic">Subtotal</span>
                    <span className="font-semibold text-black font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-serif italic">Delivery Service</span>
                    <span className="font-semibold text-black">
                      {shipping === 0 ? <span className="text-emerald-700 font-serif italic">FREE</span> : <span className="font-mono">${shipping.toFixed(2)}</span>}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-serif italic">Estimated Tax</span>
                    <span className="font-semibold text-black font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-black/10 pt-3 flex justify-between items-baseline text-sm">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-black/40">Final Total</span>
                    <span className="font-serif text-lg text-black font-medium font-mono">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-black/10 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[10px] uppercase tracking-wider font-bold text-black/50 hover:text-black flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Payment
                  </button>
                  <button
                    id="place-order-final-btn"
                    type="button"
                    onClick={handlePlaceOrder}
                    className="py-4 px-8 bg-black hover:bg-zinc-850 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Place Secure Order
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="w-16 h-16 bg-zinc-50 text-black rounded-none flex items-center justify-center mx-auto mb-2 border border-black/10">
                  <Check className="w-6 h-6 stroke-[2]" />
                </div>

                <div>
                  <span className="bg-black text-white text-[8px] font-bold px-3 py-1 rounded-none uppercase tracking-widest inline-block">
                    Order Dispatched Successfully
                  </span>
                  <h3 className="font-serif italic font-light text-3xl text-neutral-950 mt-4">
                    Thanks for shopping with us!
                  </h3>
                  <p className="text-xs text-neutral-400 font-serif italic max-w-sm mx-auto mt-2 leading-relaxed">
                    We have successfully captured your secure order under receipt <strong className="text-black font-mono">{orderId}</strong>. A tracking confirmation has been sent to <strong className="text-neutral-800">{email}</strong>.
                  </p>
                </div>

                {/* Delivery tracker animation simulation */}
                <div className="bg-[#FAF9F6] border border-black/10 rounded-none p-5 max-w-md mx-auto text-left space-y-4">
                  <h4 className="text-[8px] uppercase font-bold text-black/40 tracking-widest">Estimated Delivery Progress</h4>
                  
                  <div className="relative pt-2">
                    <div className="absolute top-4 left-0 right-0 h-px bg-black/10" />
                    <div className="absolute top-4 left-0 w-1/3 h-px bg-black" />
                    
                    <div className="flex justify-between items-center relative z-10 text-[9px]">
                      <div className="flex flex-col items-center">
                        <span className="w-5 h-5 rounded-none bg-black text-white flex items-center justify-center font-bold">
                          <Truck className="w-3 h-3" />
                        </span>
                        <span className="font-bold text-black uppercase tracking-wider mt-1.5 text-[8px]">Sourcing</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="w-5 h-5 rounded-none bg-white text-black/30 border border-black/10 flex items-center justify-center font-bold">
                          2
                        </span>
                        <span className="font-bold text-black/30 uppercase tracking-wider mt-1.5 text-[8px]">Transit</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="w-5 h-5 rounded-none bg-white text-black/30 border border-black/10 flex items-center justify-center font-bold">
                          3
                        </span>
                        <span className="font-bold text-black/30 uppercase tracking-wider mt-1.5 text-[8px]">Delivered</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-black/40 text-center pt-3 font-serif italic">
                    Estimated arrival window: <strong className="text-black">July 20 - July 22, 2026</strong> (Express Courier).
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="py-4 px-8 bg-black hover:bg-zinc-850 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold transition-colors cursor-pointer"
                  >
                    Return to Store
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
