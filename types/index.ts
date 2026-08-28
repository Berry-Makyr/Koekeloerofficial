export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  features: string[];
  dimensions?: string;
  materials?: string;
  careInstructions?: string;
  origin?: string;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  stockCount: number;
  images: string[];
  badges?: string[];
  variants?: {
    type: 'size' | 'color' | 'finish';
    options: string[];
  }[];
  tags: string[];
  isFeatured?: boolean;
  isSale?: boolean;
  isNewArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  featured?: boolean;
}

export interface StoreLocation {
  id: string;
  name: string;
  town: string;
  address: string;
  complex?: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    publicHolidays: string;
  };
  features: string[];
  mapEmbedUrl: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}
