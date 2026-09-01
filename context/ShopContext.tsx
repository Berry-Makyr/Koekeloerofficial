'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Category, SiteContent, HeroSlide, LookbookItem } from '@/types';
import { FREE_SHIPPING_THRESHOLD, COUPON_CODES } from '@/lib/utils';
import { products as defaultProducts, defaultSiteContent } from '@/data/products';
import { categories as defaultCategories } from '@/data/categories';

interface ShopContextType {
  // Products Management
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  // Categories Management (Admin & Shop)
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updated: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  resetCategories: () => void;

  // Site Content & Banners Management
  siteContent: SiteContent;
  updateSiteContent: (updated: Partial<SiteContent>) => void;
  updateHeroSlide: (index: number, slide: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (index: number) => void;
  updateLookbookItem: (index: number, item: Partial<LookbookItem>) => void;
  resetSiteContent: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: Record<string, string>) => void;
  removeFromCart: (productId: string, variantKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantKey?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  discountAmount: number;
  cartTotal: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Coupon
  activeCoupon: string | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  couponDiscountPercent: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

function getVariantKey(variants?: Record<string, string>): string {
  if (!variants || Object.keys(variants).length === 0) return 'default';
  return Object.entries(variants)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [productsList, setProductsList] = useState<Product[]>(defaultProducts);
  const [categoriesList, setCategoriesList] = useState<Category[]>(defaultCategories);
  const [siteContentState, setSiteContentState] = useState<SiteContent>(defaultSiteContent);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      // Products
      const savedProducts = localStorage.getItem('koekeloer_custom_products_v10');
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProductsList(parsed);
        } else {
          setProductsList(defaultProducts);
          localStorage.setItem('koekeloer_custom_products_v10', JSON.stringify(defaultProducts));
        }
      } else {
        setProductsList(defaultProducts);
        localStorage.setItem('koekeloer_custom_products_v10', JSON.stringify(defaultProducts));
      }

      // Categories
      const savedCategories = localStorage.getItem('koekeloer_custom_categories_v7');
      if (savedCategories) {
        const parsed = JSON.parse(savedCategories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCategoriesList(parsed);
        } else {
          setCategoriesList(defaultCategories);
          localStorage.setItem('koekeloer_custom_categories_v7', JSON.stringify(defaultCategories));
        }
      } else {
        setCategoriesList(defaultCategories);
        localStorage.setItem('koekeloer_custom_categories_v7', JSON.stringify(defaultCategories));
      }

      // Site Content
      const savedContent = localStorage.getItem('koekeloer_site_content_v9');
      if (savedContent) {
        const parsed = JSON.parse(savedContent);
        if (parsed && typeof parsed === 'object') {
          setSiteContentState({ ...defaultSiteContent, ...parsed });
        } else {
          setSiteContentState(defaultSiteContent);
        }
      } else {
        setSiteContentState(defaultSiteContent);
      }

      // Cart & Wishlist
      const savedCart = localStorage.getItem('koekeloer_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('koekeloer_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCoupon = localStorage.getItem('koekeloer_coupon');
      if (savedCoupon) setActiveCoupon(savedCoupon);
    } catch (e) {
      console.error('Error hydrating store from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Sync products to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('koekeloer_custom_products_v10', JSON.stringify(productsList));
    } catch (e) {
      console.error('Error saving custom products', e);
    }
  }, [productsList, isHydrated]);

  // Sync categories to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('koekeloer_custom_categories_v7', JSON.stringify(categoriesList));
    } catch (e) {
      console.error('Error saving custom categories', e);
    }
  }, [categoriesList, isHydrated]);

  // Sync site content to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('koekeloer_site_content_v9', JSON.stringify(siteContentState));
    } catch (e) {
      console.error('Error saving site content', e);
    }
  }, [siteContentState, isHydrated]);

  // Sync cart & wishlist
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('koekeloer_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('koekeloer_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist', e);
    }
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (activeCoupon) {
        localStorage.setItem('koekeloer_coupon', activeCoupon);
      } else {
        localStorage.removeItem('koekeloer_coupon');
      }
    } catch (e) {
      console.error('Error saving coupon', e);
    }
  }, [activeCoupon, isHydrated]);

  // Product Management Operations
  const addProduct = (product: Product) => {
    setProductsList((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((wId) => wId !== id));
  };

  const resetProducts = () => {
    setProductsList(defaultProducts);
    try {
      localStorage.setItem('koekeloer_custom_products_v10', JSON.stringify(defaultProducts));
    } catch (e) {
      console.error(e);
    }
  };

  // Category Management Operations
  const addCategory = (category: Category) => {
    setCategoriesList((prev) => [...prev, category]);
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategoriesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
  };

  const resetCategories = () => {
    setCategoriesList(defaultCategories);
    try {
      localStorage.setItem('koekeloer_custom_categories_v7', JSON.stringify(defaultCategories));
    } catch (e) {
      console.error(e);
    }
  };

  // Site Content Management Operations
  const updateSiteContent = (updated: Partial<SiteContent>) => {
    setSiteContentState((prev) => ({ ...prev, ...updated }));
  };

  const updateHeroSlide = (index: number, updatedSlide: Partial<HeroSlide>) => {
    setSiteContentState((prev) => {
      const slides = [...prev.heroSlides];
      if (slides[index]) {
        slides[index] = { ...slides[index], ...updatedSlide };
      }
      return { ...prev, heroSlides: slides };
    });
  };

  const addHeroSlide = (slide: HeroSlide) => {
    setSiteContentState((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, slide],
    }));
  };

  const deleteHeroSlide = (index: number) => {
    setSiteContentState((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index),
    }));
  };

  const updateLookbookItem = (index: number, item: Partial<LookbookItem>) => {
    setSiteContentState((prev) => {
      const items = [...prev.lookbookItems];
      if (items[index]) {
        items[index] = { ...items[index], ...item };
      }
      return { ...prev, lookbookItems: items };
    });
  };

  const resetSiteContent = () => {
    setSiteContentState(defaultSiteContent);
    try {
      localStorage.setItem('koekeloer_site_content_v9', JSON.stringify(defaultSiteContent));
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (product: Product, quantity = 1, selectedVariant?: Record<string, string>) => {
    const variantKey = getVariantKey(selectedVariant);
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && getVariantKey(item.selectedVariant) === variantKey
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, quantity, selectedVariant }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantKey = 'default') => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && getVariantKey(item.selectedVariant) === variantKey)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantKey = 'default') => {
    if (quantity <= 0) {
      removeFromCart(productId, variantKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && getVariantKey(item.selectedVariant) === variantKey) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (_code: string): boolean => {
    setActiveCoupon(null);
    setCouponError(null);
    return false;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    setCouponError(null);
  };

  const couponDiscountPercent = activeCoupon && COUPON_CODES[activeCoupon] ? COUPON_CODES[activeCoupon].discountPercent : 0;

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(
    () => (cartSubtotal * couponDiscountPercent) / 100,
    [cartSubtotal, couponDiscountPercent]
  );

  const cartTotal = useMemo(() => Math.max(0, cartSubtotal - discountAmount), [cartSubtotal, discountAmount]);

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <ShopContext.Provider
      value={{
        products: productsList,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        categories: categoriesList,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
        siteContent: siteContentState,
        updateSiteContent,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        updateLookbookItem,
        resetSiteContent,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        discountAmount,
        cartTotal,
        freeShippingRemaining,
        freeShippingProgress,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isSearchOpen,
        setIsSearchOpen,
        activeCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        couponDiscountPercent,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
