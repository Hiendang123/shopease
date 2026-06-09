import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'AcousticMax Wireless Headphones',
    price: 129.99,
    description: 'Immersive sound with premium hybrid active noise cancellation. Features ultra-soft protein leather earcups, 40-hour battery life, and high-fidelity dynamic drivers for breathtaking audio quality.',
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    rating_count: 124,
    stock_quantity: 15
  },
  {
    id: 'prod-002',
    name: 'ChronoLite Smart Fitness Watch',
    price: 89.50,
    description: 'Track your health and lifestyle. Features 24/7 heart rate monitoring, blood oxygen tracking, personalized sleep score, sleep stage insights, stress level tracking, and GPS workout logging.',
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    rating_count: 89,
    stock_quantity: 24
  },
  {
    id: 'prod-003',
    name: 'Vagabond Canvas Daypack',
    price: 59.00,
    description: 'A robust water-resistant laptop backpack made with thick canvas and genuine leather straps. Features ergonomic padded shoulder straps, multiple internal organization pockets, and a hidden secure transit pocket.',
    category: 'Fashion',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    rating_count: 212,
    stock_quantity: 8
  },
  {
    id: 'prod-004',
    name: 'Somerset Amber Sunglasses',
    price: 45.00,
    description: 'Classic handcrafted keyhole-bridge acetate frames fitted with premium polarized amber lenses. Highly durable double-barrel hinges offering 100% UVA/UVB protection.',
    category: 'Fashion',
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
    rating: 4.3,
    rating_count: 56,
    stock_quantity: 12
  },
  {
    id: 'prod-005',
    name: 'Artisan Dark Roast Coffee Beans (1kg)',
    price: 24.99,
    description: 'Single-origin specialty certified organic Arabica beans carefully handpicked and small-batch roasted. Features a complex, full-bodied chocolate aroma and subtle hazelnut undertones.',
    category: 'Food',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    rating_count: 340,
    stock_quantity: 50
  },
  {
    id: 'prod-006',
    name: 'Uji Ceremonal Grade Matcha Powder',
    price: 38.00,
    description: 'Pure ceremonial-grade matcha ground using traditional stone mills in Uji, Kyoto. Extremely high antioxidant count, creamy texture, and rich with deep, pleasant umami notes.',
    category: 'Food',
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    rating_count: 118,
    stock_quantity: 30
  },
  {
    id: 'prod-007',
    name: 'Luminous Glow Hydrating Serum',
    price: 32.50,
    description: 'Infused with high concentration multi-molecular Hyaluronic Acid, Niacinamide, and organic Rosewater. Delivers deep cellular hydration, evens skin tone, and locks in moisture for a radiant dewy complexion.',
    category: 'Beauty',
    image_url: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    rating_count: 145,
    stock_quantity: 18
  },
  {
    id: 'prod-008',
    name: 'Velvet Rose Handcrafted Soy Candle',
    price: 18.00,
    description: 'Hand-poured pure soy wax candle infused with organic rose essential oils and loaded with double wooden wicks. Clean soot-free 50-hour burn time with a soft soothing floral fragrance.',
    category: 'Beauty',
    image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    rating_count: 73,
    stock_quantity: 40
  }
];
