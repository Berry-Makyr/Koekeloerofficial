'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  ChevronDown, 
  Compass,
  Sparkles
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen, categories } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <header className={cn(
      "sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md transition-all duration-300 border-b",
      isScrolled ? "border-sand-200 shadow-soft py-2.5" : "border-sand-200/60 py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-driftwood-800 hover:text-coastal-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-driftwood-700 hover:text-coastal-800 sm:hidden"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block group">
              <span className="block font-serif text-2xl sm:text-3xl tracking-widest text-coastal-950 uppercase font-semibold group-hover:text-coastal-700 transition">
                KOEKELOER
              </span>
              <span className="block text-[9px] sm:text-[10px] tracking-[0.25em] text-sand-600 uppercase font-medium -mt-1">
                Gansbaai • Décor & Boutique
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-driftwood-800">
            <Link 
              href="/" 
              className={cn(
                "hover:text-coastal-700 transition py-1 relative",
                pathname === '/' && "text-coastal-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-600"
              )}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href="/shop"
                className={cn(
                  "flex items-center gap-1 hover:text-coastal-700 transition py-1",
                  pathname.startsWith('/shop') && "text-coastal-800 font-semibold"
                )}
              >
                <span>Shop Collections</span>
                <ChevronDown className="w-4 h-4 text-driftwood-500 group-hover:rotate-180 transition-transform duration-200" />
              </Link>

              {/* Mega Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-white rounded-xl shadow-lift border border-sand-200 p-6 grid grid-cols-2 gap-4 mt-2 transition animate-in fade-in duration-150">
                  <div className="col-span-2 pb-2 border-b border-sand-100 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-sand-700">Browse Departments</span>
                    <Link href="/shop" className="text-xs text-coastal-600 hover:text-coastal-800 font-semibold flex items-center gap-1">
                      View All Products →
                    </Link>
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.slug}`}
                      className="group/item flex items-start gap-3 p-2.5 rounded-lg hover:bg-sand-50 transition"
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-sand-100 flex-shrink-0 border border-sand-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover/item:scale-105 transition" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-driftwood-900 group-hover/item:text-coastal-700 transition">
                          {cat.name}
                        </p>
                        <p className="text-xs text-driftwood-500 line-clamp-1">
                          {cat.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 bg-sand-100/60 p-3 rounded-lg flex items-center justify-between text-xs text-driftwood-700">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-terracotta-500" />
                      <span>Direct Imports from Bali & local handcrafted pieces</span>
                    </div>
                    <Link href="/shop?filter=sale" className="font-semibold text-terracotta-600 hover:underline">
                      View Sale Items
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/shop?category=boutique-fashion" 
              className="hover:text-coastal-700 transition py-1 text-driftwood-800"
            >
              Boutique & Shoes
            </Link>

            <Link 
              href="/stores" 
              className={cn(
                "hover:text-coastal-700 transition py-1 relative",
                pathname === '/stores' && "text-coastal-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-600"
              )}
            >
              Store Locator
            </Link>

            <Link 
              href="/about" 
              className={cn(
                "hover:text-coastal-700 transition py-1 relative",
                pathname === '/about' && "text-coastal-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-600"
              )}
            >
              Our Story
            </Link>

            <Link 
              href="/contact" 
              className={cn(
                "hover:text-coastal-700 transition py-1 relative",
                pathname === '/contact' && "text-coastal-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-coastal-600"
              )}
            >
              Contact
            </Link>

            <Link 
              href="/admin" 
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-semibold border transition flex items-center gap-1",
                pathname === '/admin' 
                  ? "bg-coastal-800 text-white border-coastal-800"
                  : "bg-sand-100 text-driftwood-700 border-sand-300/80 hover:bg-sand-200"
              )}
            >
              <Sparkles className="w-3 h-3 text-sand-500" />
              <span>Admin / Listings</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Desktop Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-driftwood-600 bg-sand-100 hover:bg-sand-200/80 rounded-full border border-sand-300/60 transition"
              aria-label="Search catalog"
            >
              <Search className="w-3.5 h-3.5 text-driftwood-500" />
              <span>Search decor, fashion...</span>
              <kbd className="hidden md:inline-block bg-white px-1.5 py-0.5 rounded border border-sand-300 text-[10px] text-driftwood-400">⌘K</kbd>
            </button>

            {/* WhatsApp Quick Chat */}
            <a
              href="https://wa.me/27787030250?text=Hi%20Koekeloer%20Team,%20I'm%20browsing%20your%20online%20store%20and%20would%20like%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3 py-1.5 rounded-full transition"
              title="Chat with us on WhatsApp"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Wishlist Link */}
            <Link
              href="/shop?filter=wishlist"
              className="p-2 text-driftwood-700 hover:text-terracotta-600 transition relative"
              aria-label={`Wishlist (${wishlist.length} items)`}
              title="View Wishlist"
            >
              <Heart className={cn("w-5 h-5", wishlist.length > 0 && "fill-terracotta-500 text-terracotta-500")} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-terracotta-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-coastal-900 hover:text-coastal-700 transition relative flex items-center"
              aria-label={`Cart (${cartCount} items)`}
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-coastal-700 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sand-200 bg-sand-50 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-driftwood-900 hover:bg-sand-100"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block px-3 py-2 rounded-md text-base font-medium text-driftwood-900 hover:bg-sand-100 font-semibold"
            >
              All Products & Collections
            </Link>
            
            <div className="pl-4 py-1 space-y-1 border-l-2 border-sand-300 my-1">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="block px-2 py-1.5 text-sm text-driftwood-700 hover:text-coastal-800"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link
              href="/stores"
              className="block px-3 py-2 rounded-md text-base font-medium text-driftwood-900 hover:bg-sand-100"
            >
              Store Locations (Gansbaai & Bredasdorp)
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-driftwood-900 hover:bg-sand-100"
            >
              Our Story & 40 Years of Retail
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-driftwood-900 hover:bg-sand-100"
            >
              Contact Us
            </Link>
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-semibold text-coastal-800 bg-sand-100/70 hover:bg-sand-200"
            >
              ✨ Manage Listings (Admin)
            </Link>
          </div>

          <div className="pt-3 border-t border-sand-200 flex flex-col gap-2">
            <a
              href="https://wa.me/27787030250?text=Hi%20Koekeloer%20Team,%20I'm%20browsing%20your%20online%20store%20and%20would%20like%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-medium py-2.5 rounded-lg text-sm shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Store Enquiries (+27 78 703 0250)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
