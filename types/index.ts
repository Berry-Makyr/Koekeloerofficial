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

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  description?: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
}

export interface PromoBannerConfig {
  tag: string;
  title: string;
  highlightText: string;
  description: string;
  couponCode: string;
  ctaText: string;
  ctaLink: string;
  footerNote: string;
}

export interface BrandStoryConfig {
  tag: string;
  title: string;
  yearsBadge: string;
  yearsText: string;
  paragraph1: string;
  paragraph2: string;
  features: { title: string; description: string }[];
  images: {
    showroom: string;
    art: string;
    furniture: string;
    boutique: string;
  };
  ctaText: string;
  secondaryCtaText: string;
}

export interface LookbookItem {
  id: number;
  image: string;
  title: string;
  tag: string;
  link?: string;
}

export interface SiteContent {
  announcement: {
    message: string;
    couponPrompt: string;
    couponCode: string;
  };
  heroSlides: HeroSlide[];
  promoBanner: PromoBannerConfig;
  brandStory: BrandStoryConfig;
  lookbookTitle: string;
  lookbookSubtitle: string;
  lookbookItems: LookbookItem[];
  footerBio: string;
}

