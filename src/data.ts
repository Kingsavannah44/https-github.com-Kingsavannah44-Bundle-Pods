import { Product, Bundle, Review } from './types';

export const products: Product[] = [
  {
    id: 'buds-pod-pro',
    name: 'Buds Pod Pro',
    category: 'Music',
    price: 79.90,
    originalPrice: 99.90,
    rating: 5.0,
    reviewsCount: 1240,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    description: 'Our flagship wireless earbuds with Hybrid Active Noise Cancellation, Ultra-Dynamic drivers, and an ergonomic pod design for secure, long-wear comfort.',
    features: [
      'Hybrid Active Noise Cancelling (up to 42dB)',
      'High-Res Audio with custom balanced armature drivers',
      'Up to 40 hours total battery life with Qi Wireless Case',
      'IPX7 Sweat and Water Resistance',
      'Transparency Mode and Smart Wear Detection'
    ],
    specs: {
      'Bluetooth Version': 'v5.3',
      'Driver Size': '11mm Dynamic + Balanced Armature',
      'Battery Life': '8h (Buds) / 40h (with Case)',
      'Waterproof Rating': 'IPX7',
      'Charging Port': 'USB Type-C & Qi Wireless'
    },
    isBestSeller: true,
    isDiscounted: true
  },
  {
    id: 'buds-pod-lite',
    name: 'Buds Pod Lite',
    category: 'Music',
    price: 39.90,
    rating: 4.8,
    reviewsCount: 840,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=600&q=80',
    description: 'Super lightweight, ultra-compact earbuds packed with deep, punchy bass, fast touch controls, and dual beamforming microphones for crystal-clear calls.',
    features: [
      'Ultra-lightweight design (3.8g per earbud)',
      'Deep Bass Acoustic chamber tuning',
      'Dual mic environmental noise cancellation for calls',
      '28 hours of total playtime',
      'Rapid Charge: 10 mins gives 2 hours of play'
    ],
    specs: {
      'Bluetooth Version': 'v5.2',
      'Driver Size': '8.2mm Custom Dynamic',
      'Battery Life': '6h (Buds) / 28h (with Case)',
      'Waterproof Rating': 'IPX5',
      'Charging Port': 'USB Type-C'
    },
    isNew: true
  },
  {
    id: 'sound-pod-mini',
    name: 'Sound Pod Mini',
    category: 'Music',
    price: 49.90,
    originalPrice: 59.90,
    rating: 4.9,
    reviewsCount: 450,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    description: 'A pocket-sized powerhouse speaker delivering rich, 360-degree room-filling audio, elegant fabric grille design, and stereo pairing capabilities.',
    features: [
      'Omnidirectional 360° Surround Sound',
      'True Wireless Stereo (TWS) pairing with a second unit',
      'Rugged IPX6 weather-resistant construction',
      'Up to 15 hours of continuous wireless playback',
      'Tactile premium rubberized control buttons'
    ],
    specs: {
      'Bluetooth Version': 'v5.1',
      'Output Power': '10W RMS',
      'Frequency Response': '80Hz - 20kHz',
      'Battery Capacity': '2200mAh',
      'Dimensions': '85mm x 85mm x 105mm'
    },
    isDiscounted: true
  },
  {
    id: 'charge-pod-dual',
    name: 'Charge Pod Dual',
    category: 'Storage',
    price: 29.90,
    rating: 5.0,
    reviewsCount: 1120,
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80',
    description: 'Dual-charging premium wireless pad crafted with space-grade aluminum and wrapped in soft textured fabric to charge your phone and earbud pod simultaneously at max speed.',
    features: [
      'Simultaneous 15W + 10W dual wireless charging',
      'Smart power allocation protects battery health',
      'Premium fabric top prevents phone slips and scratches',
      'Foreign Object Detection and over-temp protection',
      'Includes high-performance 30W USB-PD wall adapter'
    ],
    specs: {
      'Input': '9V/3A, 12V/2.5A',
      'Output 1': '15W Max (Phone/Qi)',
      'Output 2': '10W Max (Pods/Qi)',
      'Material': 'Anodized Aluminum + Premium Fabric',
      'Thickness': 'Just 6.5mm'
    },
    isBestSeller: true
  },
  {
    id: 'pocket-pod-stand',
    name: 'Pocket Pod Stand',
    category: 'Other',
    price: 15.00,
    originalPrice: 19.90,
    rating: 4.8,
    reviewsCount: 950,
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80',
    description: 'Fully collapsible, adjustable desktop stand made of solid heavy-duty alloy. Keeps your smartphone, tablet, or Earbud Pod case elevated at the perfect angle for work or calls.',
    features: [
      'Multi-angle & dual-height adjustable joint arms',
      'Heavy-duty weighted non-slip base plates',
      'Fully collapsible pocket-sized design for travel',
      'Silicone padding guards against device scratches',
      'Convenient bottom cutout for charging cables'
    ],
    specs: {
      'Material': 'Space-grade Aluminum Alloy + Premium Silicone',
      'Collapsed Size': '110mm x 65mm x 25mm',
      'Weight': '190g',
      'Compatibility': '4" to 11" devices & Pod cases',
      'Angle Adjust': 'Up to 270 degrees'
    },
    isDiscounted: true
  },
  {
    id: 'sub-pod-air',
    name: 'Sub-Pod Air Cleaner',
    category: 'Home',
    price: 34.90,
    rating: 4.7,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1601924582970-d24f028f200f?auto=format&fit=crop&w=600&q=80',
    description: 'A compact, smart desktop air purifier shaped like a massive aesthetic pod. Features a true HEPA H13 filter to clean the air at your desk, bedside, or workstation.',
    features: [
      'True HEPA H13 active carbon filtration',
      'Removes 99.97% of dust, pollen, smoke, and odors',
      'Whisper-quiet Sleep Mode (under 24dB)',
      'Built-in aromatherapy oil diffuser tray',
      'Ambient warm halo night light ring'
    ],
    specs: {
      'Coverage Area': 'Up to 150 sq ft / 15 m²',
      'Filter Type': 'Pre-filter + H13 HEPA + Activated Carbon',
      'Noise Level': '22dB - 44dB',
      'Rated Power': '12W',
      'Dimensions': '160mm Diameter x 210mm Height'
    },
    isNew: true
  },
  {
    id: 'armor-pod-case',
    name: 'Armor Pod Case',
    category: 'Storage',
    price: 14.90,
    rating: 4.9,
    reviewsCount: 610,
    image: 'https://images.unsplash.com/photo-1610438235354-a6fa554807b1?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-durable, military-grade rugged protective shell for your Buds Pod Pro case. Features carbon-fiber textures, metal latch guards, and a heavy-duty carabiner.',
    features: [
      'Dual-layer shock-absorbent TPU and hard PC frame',
      'Anodized aluminum alloy lock clasp prevents accidental opens',
      'Wireless charging compatible through the case body',
      'Exposed status LED light and precision charging port cutouts',
      'Includes tactical spring carabiner and wrist lanyard'
    ],
    specs: {
      'Material': 'TPU + Polycarbonate + Aluminum',
      'Drop Protection': 'Up to 10 feet / 3 meters',
      'Weight': '32g',
      'In the Box': 'Case, carabiner, wrist strap, adhesive pads'
    }
  },
  {
    id: 'sleek-leather-case',
    name: 'Sleek Leather Case',
    category: 'Other',
    price: 19.90,
    rating: 4.6,
    reviewsCount: 190,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    description: 'Handcrafted with premium vegetable-tanned full-grain leather that develops a gorgeous unique patina over time. Snugly fits your Buds Pod case for an editorial style.',
    features: [
      '100% genuine full-grain vegetable-tanned leather',
      'Soft microfiber interior lining prevents scuffs',
      'Hand-stitched perimeter detailing',
      'Built-in brass snap closure buttons',
      'Cutout for bottom charging port accessibility'
    ],
    specs: {
      'Material': 'Full-Grain Leather + Microfiber + Brass',
      'Style': 'Classic Heritage Capsule',
      'Weight': '20g',
      'Wireless Charging': 'Fully Supported'
    }
  },
  {
    id: 'smart-pod-watch',
    name: 'Smart Pod Watch',
    category: 'Phone',
    price: 59.90,
    rating: 4.8,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    description: 'A minimalist round smartwatch featuring real-time fitness metrics, sleep tracking, heart-rate monitoring, and direct integration with your Buds Pod for direct audio controls.',
    features: [
      'Sleek circular custom high-definition AMOLED screen',
      'Complete health dashboard: SpO2, heart-rate, stress tracker',
      'Dedicated remote media and volume control interface for Pods',
      '10-day battery life on a single fast magnetic charge',
      'Over 50 custom sports modes and GPS route linking'
    ],
    specs: {
      'Screen Size': '1.3-inch AMOLED (360x360)',
      'Waterproof': '5 ATM (swim-proof up to 50m)',
      'Sensors': 'Optical heart-rate, Accelerometer, Gyroscope',
      'Battery Capacity': '280mAh',
      'Strap Width': '20mm Interchangeable'
    },
    isNew: true
  }
];

export const predefinedBundles: Bundle[] = [
  {
    id: 'bundle-ultimate-sound',
    name: 'The Ultimate Sound Bundle',
    products: [
      products.find(p => p.id === 'buds-pod-pro')!,
      products.find(p => p.id === 'sound-pod-mini')!,
      products.find(p => p.id === 'armor-pod-case')!
    ],
    price: 119.90,
    originalPrice: 144.70,
    discountPercentage: 17,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    description: 'Everything you need for perfect sound in any space. Get the premium Buds Pod Pro, the portable Sound Pod speaker, and our rugged Armor Pod Case.'
  },
  {
    id: 'bundle-workspace-duo',
    name: 'The Workspace Duo',
    products: [
      products.find(p => p.id === 'pocket-pod-stand')!,
      products.find(p => p.id === 'charge-pod-dual')!
    ],
    price: 34.90,
    originalPrice: 44.90,
    discountPercentage: 22,
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&w=600&q=80',
    description: 'An elegant desktop setup. Power your phone and earbud pod simultaneously with the Charge Pod Dual on top of our sturdy, adjustable metal Stand.'
  },
  {
    id: 'bundle-active-pod',
    name: 'Active Pod Pack',
    products: [
      products.find(p => p.id === 'buds-pod-lite')!,
      products.find(p => p.id === 'armor-pod-case')!,
      products.find(p => p.id === 'smart-pod-watch')!
    ],
    price: 89.90,
    originalPrice: 114.70,
    discountPercentage: 21,
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=600&q=80',
    description: 'Designed for the active lifestyle. Track your runs, control your audio remotely, and protect your lightweight pods during heavy workouts.'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'buds-pod-pro',
    userName: 'Marcus Vance',
    rating: 5,
    date: 'July 12, 2026',
    comment: 'The noise cancellation is shockingly good. Competes easily with brands twice the price. Ergonomics are exceptional; they never slip out.'
  },
  {
    id: 'rev-2',
    productId: 'buds-pod-pro',
    userName: 'Elena Rostova',
    rating: 5,
    date: 'July 05, 2026',
    comment: 'I am in love with the modern look of these pods! The custom audio is crisp, treble is clear, and base is rich. Recommend to everyone.'
  },
  {
    id: 'rev-3',
    productId: 'charge-pod-dual',
    userName: 'Aria Chen',
    rating: 5,
    date: 'June 28, 2026',
    comment: 'Minimalist and fast! Fits my desk aesthetic perfectly. No more annoying cable clutter on my nightstand. Excellent build quality!'
  }
];
