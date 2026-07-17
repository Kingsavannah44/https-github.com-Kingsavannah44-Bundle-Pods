import { useState, useMemo, FormEvent } from 'react';
import { products as initialProducts, predefinedBundles, initialReviews } from './data';
import { Product, Bundle, CartItem, Review, FilterState } from './types';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import BundleBuilder from './components/BundleBuilder';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { 
  Search, 
  ShoppingCart, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Mail, 
  ArrowRight,
  Heart,
  HelpCircle,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  CheckCircle,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Application registries
  const [products] = useState<Product[]>(initialProducts);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // UI States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Recommendations Slider Index
  const [recIndex, setRecIndex] = useState(0);

  // Filter & Search states
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    searchTerm: '',
    sortBy: 'recommended',
    tag: 'all'
  });

  // Category tags
  const categoriesList = ['all', 'Music', 'Home', 'Phone', 'Storage', 'Other'];

  // Add review callback
  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const reviewWithMeta: Review = {
      ...newReview,
      id: `rev-user-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    setReviews(prev => [reviewWithMeta, ...prev]);
  };

  // Add individual product with color option
  const handleAddToCart = (product: Product, quantity: number, color: string = 'Classic Slate') => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.type === 'product' && 
        item.product?.id === product.id && 
        item.selectedColor === color
      );

      if (existingIdx > -1) {
        const nextCart = [...prev];
        nextCart[existingIdx].quantity += quantity;
        return nextCart;
      }

      const newItem: CartItem = {
        id: `prod-${product.id}-${color}`,
        type: 'product',
        product,
        quantity,
        selectedColor: color
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  // Add Predefined Bundle to cart
  const handleAddBundleToCart = (bundle: Bundle) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.type === 'bundle' && 
        item.bundle?.id === bundle.id
      );

      if (existingIdx > -1) {
        const nextCart = [...prev];
        nextCart[existingIdx].quantity += 1;
        return nextCart;
      }

      const newItem: CartItem = {
        id: `bundle-${bundle.id}`,
        type: 'bundle',
        bundle,
        quantity: 1
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  // Add Custom User Bundle to cart
  const handleAddCustomBundleToCart = (selectedProducts: Product[], bundleName: string, calculatedPrice: number) => {
    // Generate a transient mockup bundle representation
    const mockupBundle: Bundle = {
      id: `custom-bundle-${Date.now()}`,
      name: bundleName,
      products: selectedProducts,
      price: calculatedPrice,
      originalPrice: selectedProducts.reduce((sum, p) => sum + p.price, 0),
      discountPercentage: 15,
      image: selectedProducts[0]?.image || '',
      description: `Bespoke configuration: ${selectedProducts.map(p => p.name).join(' + ')}`
    };

    const newItem: CartItem = {
      id: mockupBundle.id,
      type: 'custom_bundle',
      bundle: mockupBundle,
      customBundleProducts: selectedProducts,
      quantity: 1
    };

    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Cart adjustment controls
  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : item;
        }
        return item;
      });
    });
  };

  const handleRemoveCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  // Live filtered products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query matching
    if (filters.searchTerm.trim() !== '') {
      const q = filters.searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category matching
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Tag filter sorting
    if (filters.tag === 'new') {
      result = result.filter(p => p.isNew);
    } else if (filters.tag === 'bestseller') {
      result = result.filter(p => p.isBestSeller);
    } else if (filters.tag === 'discount') {
      result = result.filter(p => p.isDiscounted);
    }

    // Sorting
    if (filters.sortBy === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, filters]);

  // Pagination metrics
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSubscribed(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans selection:bg-black selection:text-white relative text-[#111111]">
      
      {/* Header / Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
            setFilters({ category: 'all', searchTerm: '', sortBy: 'recommended', tag: 'all' });
            setCurrentPage(1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <div>
              <span className="font-serif italic font-light tracking-tight text-2xl text-[#111111] block leading-none">Bundle Pods</span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-black/40 font-bold block mt-1">Audio Labs // Edition</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.25em] font-bold">
            <button 
              onClick={() => {
                setFilters({ category: 'all', searchTerm: '', sortBy: 'recommended', tag: 'all' });
                setCurrentPage(1);
                document.getElementById('explore-collection')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="hover:opacity-50 cursor-pointer transition-opacity text-black"
            >
              Collections
            </button>
            <button 
              onClick={() => document.getElementById('bundle-builder-studio')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} 
              className="hover:opacity-50 cursor-pointer transition-opacity text-black flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-black/50" />
              The Studio
            </button>
            <button 
              onClick={() => document.getElementById('predefined-packs')?.scrollIntoView({ behavior: 'smooth' })} 
              className="hover:opacity-50 cursor-pointer transition-opacity text-black"
            >
              Prebuilt
            </button>
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center gap-6">
            
            {/* Live Search Bar Mini */}
            <div className="relative max-w-xs hidden sm:block">
              <input
                id="header-search-input"
                type="text"
                placeholder="Search..."
                value={filters.searchTerm}
                onChange={(e) => {
                  setFilters(f => ({ ...f, searchTerm: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-40 focus:w-52 bg-white text-xs px-3 py-2 pl-8 border border-black/5 focus:border-black/20 focus:outline-none transition-all rounded-none"
              />
              <Search className="w-3 h-3 text-black/40 absolute left-2.5 top-3" />
            </div>

            {/* Cart Trigger Button */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="text-[10px] uppercase tracking-[0.25em] font-bold flex items-center bg-transparent border-0 hover:opacity-50 transition-opacity text-[#111111] cursor-pointer"
              title="Open shopping cart"
            >
              <span className="mr-3">Cart</span>
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[8px] font-bold">
                {cartItemsCount}
              </div>
            </button>

          </div>

        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="bg-[#FAF9F6] border-b border-black/5 relative overflow-hidden py-20 md:py-28">
        
        {/* Large Decorative Backdrop Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.02]">
          <h1 className="font-display font-black text-[32vw] leading-none tracking-tighter uppercase translate-y-12">
            Pods
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          
          <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-6 block font-bold">
            Featured Drop // 001
          </span>
          
          <h1 className="font-serif font-light italic text-5xl sm:text-7xl text-neutral-900 tracking-tight max-w-3xl mx-auto leading-[0.95] mb-6">
            Give All<br/>You Need
          </h1>
          
          <p className="text-black/60 text-sm max-w-md mx-auto leading-relaxed mb-10 font-serif italic font-medium">
            Experience audiophile sound profiles, modular charging pods, and tactical armor protections. Tailored to your dynamic workspace environment.
          </p>

          {/* Interactive Search Console in Hero */}
          <div className="max-w-md mx-auto relative bg-white p-1 rounded-none border border-black/10 flex items-center gap-1.5 focus-within:border-black/30 transition-all">
            <Search className="w-3.5 h-3.5 text-black/40 shrink-0 ml-3" />
            <input
              id="hero-search-input"
              type="text"
              placeholder="Search by product, category, or features..."
              value={filters.searchTerm}
              onChange={(e) => {
                setFilters(f => ({ ...f, searchTerm: e.target.value }));
                setCurrentPage(1);
                // Auto scroll to collection if not already visible
                const el = document.getElementById('explore-collection');
                if (el) {
                  const rect = el.getBoundingClientRect();
                  if (rect.top > window.innerHeight) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="w-full text-xs text-neutral-800 bg-transparent py-2.5 px-1 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                document.getElementById('explore-collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-2.5 px-6 bg-black hover:bg-zinc-800 text-white rounded-none text-[10px] uppercase tracking-[0.2em] font-bold cursor-pointer shrink-0 transition-colors"
            >
              Search
            </button>
          </div>

        </div>
      </section>

      {/* Main E-commerce Layout Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow space-y-16">
        
        {/* EXPLORE COLLECTION GRID & SIDEBAR FILTERS */}
        <div id="explore-collection" className="scroll-mt-20">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 mb-10 border-b border-black/10 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-2 block font-bold">
                The Audio Collection
              </span>
              <h2 className="font-serif italic font-light text-3xl sm:text-4xl text-[#111111]">Explore our Pod Collections</h2>
              <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1 font-bold">Showing {filteredProducts.length} curated designs</p>
            </div>
            
            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-black/40 font-bold uppercase text-[9px] tracking-[0.2em]">Sort by //</span>
              <select
                id="sorting-select"
                value={filters.sortBy}
                onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as any }))}
                className="bg-white border border-black/10 rounded-none px-3 py-2 text-[#111111] text-[10px] uppercase tracking-wider font-bold focus:outline-none focus:border-black/30 cursor-pointer"
              >
                <option value="recommended">Best Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Customer Ratings</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            
            {/* LEFT SIDEBAR: Category Selectors & Quick Tags */}
            <aside className="md:col-span-3 space-y-10">
              
              {/* Category selector column */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black border-b border-black/10 pb-2 mb-4">Categories</h3>
                
                <div className="flex flex-col gap-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setFilters(f => ({ ...f, category: cat }));
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between border-b border-black/5 pb-2 text-left text-xs transition-opacity cursor-pointer py-1.5 ${
                        filters.category === cat
                          ? 'font-serif italic text-black font-bold'
                          : 'font-serif italic text-black/40 hover:text-black hover:opacity-100'
                      }`}
                    >
                      <span>
                        {cat === 'all' ? 'All Products' : cat}
                      </span>
                      {filters.category === cat ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                      ) : (
                        <span className="text-[9px] font-sans font-bold text-black/30 tracking-tight">
                          ({cat === 'all' ? products.length : products.filter(p => p.category === cat).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tags Filter cards */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black border-b border-black/10 pb-2 mb-4">Filter by Tag</h3>
                
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'all', label: 'All Catalog' },
                    { id: 'new', label: 'New Arrivals' },
                    { id: 'bestseller', label: 'Best Sellers' },
                    { id: 'discount', label: 'On Discount' },
                  ].map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setFilters(f => ({ ...f, tag: tag.id as any }));
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between border-b border-black/5 pb-2 text-left text-xs transition-opacity cursor-pointer py-1.5 ${
                        filters.tag === tag.id
                          ? 'font-serif italic text-black font-bold'
                          : 'font-serif italic text-black/40 hover:text-black hover:opacity-100'
                      }`}
                    >
                      <span>{tag.label}</span>
                      {filters.tag === tag.id ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-black" />
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-black/10" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </aside>

            {/* RIGHT SIDE: Products Grid Container */}
            <div className="md:col-span-9 space-y-12">
              
              {/* Product Cards Grid with Animations */}
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full py-20 text-center text-neutral-400 bg-white rounded-none border border-black/10"
                    >
                      <span className="block text-base font-serif italic text-neutral-800 mb-2">No designs match your criteria</span>
                      <p className="text-xs max-w-xs mx-auto leading-relaxed font-sans text-neutral-400">
                        Try modifying your filter tags, search keywords, or selecting another category of pod.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFilters({ category: 'all', searchTerm: '', sortBy: 'recommended', tag: 'all' });
                          setCurrentPage(1);
                        }}
                        className="mt-6 py-3 px-6 bg-black text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-none hover:bg-zinc-800 transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </motion.div>
                  ) : (
                    paginatedProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onViewDetails={(prod) => setSelectedProduct(prod)}
                      />
                    ))
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Dynamic Pagination Controls - Matches Image structure */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-black/10 pt-8">
                  
                  {/* Previous Button */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="flex items-center gap-1.5 py-2.5 px-6 rounded-none border border-black/10 bg-white hover:bg-zinc-50 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-800 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>

                  {/* Page Indices */}
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                           key={pageNum}
                           type="button"
                           onClick={() => setCurrentPage(pageNum)}
                           className={`w-8 h-8 rounded-none text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                             currentPage === pageNum
                               ? 'bg-black text-white'
                               : 'text-neutral-500 hover:border-black/20 border border-transparent'
                           }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1.5 py-2.5 px-6 rounded-none border border-black/10 bg-white hover:bg-zinc-50 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-800 disabled:opacity-30 disabled:hover:bg-white cursor-pointer transition-all"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* CUSTOM INTERACTIVE BUNDLE BUILDER COMPONENT */}
        <div className="pt-8">
          <BundleBuilder 
            products={products}
            onAddCustomBundle={handleAddCustomBundleToCart}
          />
        </div>

        {/* RECOMMENDED PRE-BUILT PACKS CAROUSEL */}
        <section id="predefined-packs" className="scroll-mt-20">
          <div className="flex justify-between items-baseline mb-10 border-b border-black/10 pb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-black/40 block mb-2">Curated Groupings // Preset Pack</span>
              <h2 className="font-serif font-light italic text-3xl sm:text-4xl text-[#111111]">Explore our Recommendations</h2>
            </div>
            
            {/* Slider Navigation arrows */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setRecIndex(i => Math.max(0, i - 1))}
                disabled={recIndex === 0}
                className="p-3 bg-white border border-black/10 rounded-none hover:bg-zinc-50 text-neutral-700 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRecIndex(i => Math.min(predefinedBundles.length - 1, i + 1))}
                disabled={recIndex === predefinedBundles.length - 1}
                className="p-3 bg-white border border-black/10 rounded-none hover:bg-zinc-50 text-neutral-700 disabled:opacity-30 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recommendations Display Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {predefinedBundles.map((bundle, idx) => {
              return (
                <div
                  key={bundle.id}
                  className={`bg-white rounded-none p-8 border transition-all duration-300 flex flex-col justify-between ${
                    recIndex === idx 
                      ? 'border-black ring-1 ring-black shadow-[0_30px_60px_rgba(0,0,0,0.06)]' 
                      : 'border-black/5 shadow-none'
                  }`}
                >
                  <div>
                    {/* Bundle Label & savings badge */}
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#111111]/60 bg-black/5 px-2.5 py-1 rounded-none">
                        Preset Collection
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-none font-serif italic">
                        Save {bundle.discountPercentage}%
                      </span>
                    </div>

                    {/* Image */}
                    <div className="aspect-video w-full rounded-none overflow-hidden bg-neutral-100 mb-6 border border-black/5">
                      <img 
                        src={bundle.image} 
                        alt={bundle.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="font-serif italic text-2xl text-[#111111] mb-2 leading-tight">
                      {bundle.name}
                    </h3>
                    <p className="text-black/60 text-xs leading-relaxed mb-6 font-serif italic min-h-[42px]">
                      {bundle.description}
                    </p>

                    {/* Included individual pods listed */}
                    <div className="space-y-2 mb-8 bg-[#FAF9F6] p-4 rounded-none border border-black/5">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-black/40 block mb-2">Specification List //</span>
                      {bundle.products.map(p => (
                        <div key={p.id} className="flex items-center justify-between text-xs text-black/70 font-serif italic border-b border-black/5 pb-1">
                          <span>{p.name}</span>
                          <span className="text-[9px] font-sans font-bold text-black/30">Active</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prices & cart trigger */}
                  <div className="border-t border-black/10 pt-6 flex items-end justify-between mt-auto">
                    <div>
                      <span className="text-xs text-black/30 block line-through leading-none mb-1 font-mono">
                        ${bundle.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xl font-serif text-[#111111] leading-none font-medium">
                        ${bundle.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBundleToCart(bundle)}
                      className="py-3.5 px-6 bg-[#111111] hover:bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-none transition-colors cursor-pointer"
                    >
                      Equip Pack
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CUSTOMER SATISFACTION NEWSLETTER BOX */}
        <section className="bg-black text-white rounded-none p-8 md:p-14 border border-black/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="absolute top-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4 text-center md:text-left max-w-lg relative z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block font-bold">The Journal // News Feed</span>
            <h2 className="font-serif italic font-light text-3xl md:text-4xl text-white">
              Ready to Get Our New Stuff?
            </h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed font-serif italic">
              Join the BUNDLE PODS community program. We’ll notify you when custom audio filters, smart charger docks, or shell cases drop in our lab.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 relative z-10">
            <form onSubmit={handleNewsletterSubmit} className="bg-transparent p-0 rounded-none max-w-sm w-full md:w-[350px] flex flex-col sm:flex-row items-stretch gap-2">
              <input
                id="newsletter-email-input"
                type="email"
                required
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-[#111111] border border-white/20 text-xs text-white py-3 px-4 focus:outline-none focus:border-white/40 rounded-none w-full"
              />
              <button
                type="submit"
                className="py-3 px-6 bg-white hover:bg-zinc-100 text-black text-[10px] uppercase tracking-[0.2em] font-bold rounded-none cursor-pointer transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <AnimatePresence>
              {newsletterSubscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 mt-3 text-emerald-400 justify-center md:justify-start"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] tracking-wider uppercase font-bold">Successfully Subscribed //</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-[#FAF9F6] border-t border-black/10 pt-20 pb-12 text-xs text-[#111111]/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          
          {/* Main Footer Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-10 items-start">
            
            {/* Branding Column */}
            <div className="col-span-2 md:col-span-4 space-y-4">
              <div>
                <span className="font-serif italic font-light tracking-tight text-2xl text-[#111111] block leading-none">Bundle Pods</span>
                <span className="text-[8px] uppercase tracking-[0.3em] text-black/40 font-bold block mt-1">Acoustic Engineering Division</span>
              </div>
              <p className="text-black/60 text-xs leading-relaxed font-serif italic max-w-xs">
                Premium audio ecosystems engineered to pack beautifully. Customize, combine, and scale your tech accessories modularly.
              </p>
            </div>

            {/* Link group 1: About */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-black uppercase text-[9px] tracking-[0.2em]">About Us</h4>
              <ul className="space-y-2 font-serif italic text-xs">
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Our Labs</button></li>
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Science & Acoustics</button></li>
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Carbon Conscious</button></li>
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Careers</button></li>
              </ul>
            </div>

            {/* Link group 2: Support */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <h4 className="font-bold text-black uppercase text-[9px] tracking-[0.2em]">Support</h4>
              <ul className="space-y-2 font-serif italic text-xs">
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Contact Desk</button></li>
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Shipping & Logistics</button></li>
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Warranty & Claims</button></li>
                <li><button type="button" className="hover:text-black transition-colors cursor-pointer text-left">Interactive FAQs</button></li>
              </ul>
            </div>

            {/* Social handles links */}
            <div className="col-span-2 md:col-span-4 space-y-4 md:text-right">
              <h4 className="font-bold text-black uppercase text-[9px] tracking-[0.2em] md:text-right">Social Channels</h4>
              <div className="flex md:justify-end gap-2">
                {[
                  { icon: <Twitter className="w-3.5 h-3.5" />, label: 'X (Twitter)' },
                  { icon: <Facebook className="w-3.5 h-3.5" />, label: 'Facebook' },
                  { icon: <Linkedin className="w-3.5 h-3.5" />, label: 'LinkedIn' },
                  { icon: <Instagram className="w-3.5 h-3.5" />, label: 'Instagram' },
                ].map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    title={s.label}
                    className="p-3 bg-white border border-black/10 hover:bg-black hover:text-white transition-all text-[#111111] cursor-pointer rounded-none"
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
              <p className="text-black/40 text-[9px] uppercase tracking-wider font-bold">Concierge Customer Desk: <strong className="text-black">24/7 Mon-Sun</strong></p>
            </div>

          </div>

          {/* Legal / Copyright details */}
          <div className="border-t border-black/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-wider text-black/40 font-bold">
            <span>Copyright © 2026 BUNDLE PODS Audio Labs. All Rights Reserved.</span>
            <div className="flex gap-6">
              <button type="button" className="hover:text-black transition-colors cursor-pointer">Terms of Service</button>
              <button type="button" className="hover:text-black transition-colors cursor-pointer">Privacy Policy</button>
              <button type="button" className="hover:text-black transition-colors cursor-pointer">Cookies Settings</button>
            </div>
          </div>

        </div>
      </footer>

      {/* RENDER MODAL: Product Details Info Screen */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        )}
      </AnimatePresence>

      {/* RENDER DRAWER: Shopping Cart Drawer Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* RENDER MODAL: Checkout Shipping/Billing Wizard */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cart={cart}
            onClearCart={() => setCart([])}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
