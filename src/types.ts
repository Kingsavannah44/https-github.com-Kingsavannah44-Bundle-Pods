export interface Product {
  id: string;
  name: string;
  category: 'Music' | 'Home' | 'Phone' | 'Storage' | 'Other';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  isNew?: boolean;
  isBestSeller?: boolean;
  isDiscounted?: boolean;
}

export interface Bundle {
  id: string;
  name: string;
  products: Product[];
  price: number;
  originalPrice: number;
  description: string;
  image: string;
  discountPercentage: number;
}

export interface CartItem {
  id: string; // can be product.id or bundle.id or custom-bundle-id
  type: 'product' | 'bundle' | 'custom_bundle';
  product?: Product;
  bundle?: Bundle;
  customBundleProducts?: Product[]; // For user-built bundles
  quantity: number;
  selectedColor?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface FilterState {
  category: string; // 'all' or specific category
  searchTerm: string;
  sortBy: 'recommended' | 'price-low-high' | 'price-high-low' | 'rating';
  tag: 'all' | 'new' | 'bestseller' | 'discount';
}
