'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  SlidersHorizontal, 
  X, 
  Grid3X3, 
  Grid2X2, 
  Search, 
  ChevronDown, 
  RotateCcw,
  Sparkles,
  Heart
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useShop } from '@/context/ShopContext';
import { formatZAR, cn } from '@/lib/utils';
import { resolveCategorySlug } from '@/lib/category-aliases';

export default function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { wishlist, products, categories } = useShop();

  // Read initial query params
  const categoryParam = resolveCategorySlug(searchParams.get('category') || 'all');
  const searchParam = searchParams.get('search') || '';
  const filterParam = searchParams.get('filter') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);
  const [selectedFilter, setSelectedFilter] = useState<string>(filterParam);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [columns, setColumns] = useState<3 | 4>(3);

  // Sync params when URL changes
  useEffect(() => {
    setSelectedCategory(resolveCategorySlug(searchParams.get('category') || 'all'));
    setSearchQuery(searchParams.get('search') || '');
    setSelectedFilter(searchParams.get('filter') || 'all');
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchCategory && !matchDesc && !matchTag) return false;
      }

      // Special filter
      if (selectedFilter === 'new' && !p.isNewArrival) return false;
      if (selectedFilter === 'wishlist' && !wishlist.includes(p.id)) return false;

      // Price limit
      if (p.price > priceRange) return false;

      // In stock only
      if (onlyInStock && p.stockStatus === 'out_of_stock') return false;

      // Badge filter
      if (selectedBadge !== 'all' && !p.badges?.includes(selectedBadge as any)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, selectedFilter, priceRange, onlyInStock, selectedBadge, sortBy, wishlist]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedFilter('all');
    setPriceRange(10000);
    setOnlyInStock(false);
    setSelectedBadge('all');
    setSortBy('featured');
    router.push('/shop');
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (selectedFilter !== 'all' ? 1 : 0) +
    (priceRange < 10000 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (selectedBadge !== 'all' ? 1 : 0);

  return (
    <div className="bg-sand-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="text-xs text-driftwood-500 mb-2">
            <span>Home</span> / <span className="text-driftwood-900 font-medium">Shop Collections</span>
            {selectedCategory !== 'all' && (
              <span> / <strong className="text-coastal-800 capitalize">{categories.find(c => c.slug === selectedCategory)?.name}</strong></span>
            )}
            {selectedFilter === 'wishlist' && <span> / <strong>My Wishlist</strong></span>}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-5xl font-bold text-driftwood-950 leading-tight">
                {selectedFilter === 'wishlist' 
                  ? 'Your Saved Wishlist'
                  : selectedCategory !== 'all' 
                    ? categories.find(c => c.slug === selectedCategory)?.name || 'Collection'
                    : 'All Collections & Decor'}
              </h1>
              <p className="text-xs sm:text-sm text-driftwood-600 mt-2 max-w-2xl">
                {selectedCategory !== 'all'
                  ? categories.find(c => c.slug === selectedCategory)?.description
                  : 'Browse our signature assortment of coastal home accessories, handcrafted furniture, and artisan gifts.'}
              </p>
            </div>

            {/* Quick Status Count */}
            <div className="text-xs text-driftwood-500 flex-shrink-0">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> items
            </div>
          </div>
        </div>

        {/* Toolbar Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-soft border border-sand-200 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 bg-sand-100 hover:bg-sand-200 text-driftwood-900 rounded-xl text-xs font-semibold flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Search inside shop */}
          <div className="relative flex-1 min-w-0 w-full sm:min-w-[200px] sm:max-w-md order-last sm:order-none basis-full sm:basis-auto">
            <Search className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full bg-sand-50 border border-sand-300/80 rounded-xl pl-9 pr-8 py-2 text-xs text-driftwood-900 placeholder-driftwood-400 focus:outline-none focus:border-coastal-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-driftwood-400 hover:text-driftwood-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Badges on Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter(selectedFilter === 'new' ? 'all' : 'new')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                selectedFilter === 'new'
                  ? "bg-sage-700 text-white border-sage-700"
                  : "bg-sand-50 text-driftwood-700 border-sand-200 hover:bg-sand-100"
              )}
            >
              New In
            </button>
            <button
              onClick={() => setSelectedBadge(selectedBadge === 'Handmade' ? 'all' : 'Handmade')}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition",
                selectedBadge === 'Handmade'
                  ? "bg-coastal-900 text-white border-coastal-900"
                  : "bg-sand-50 text-driftwood-700 border-sand-200 hover:bg-sand-100"
              )}
            >
              Handcrafted
            </button>
          </div>

          {/* Sort Dropdown & Layout Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-driftwood-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-sand-50 border border-sand-300 text-driftwood-900 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-coastal-700"
              >
                <option value="featured">Featured / Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Column toggler */}
            <div className="hidden xl:flex items-center border border-sand-200 rounded-xl overflow-hidden bg-sand-50">
              <button
                onClick={() => setColumns(3)}
                className={cn("p-2 transition", columns === 3 ? "bg-white text-coastal-800 shadow-sm" : "text-driftwood-400")}
                title="3 Columns Grid"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setColumns(4)}
                className={cn("p-2 transition", columns === 4 ? "bg-white text-coastal-800 shadow-sm" : "text-driftwood-400")}
                title="4 Columns Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-driftwood-500 font-medium">Active filters:</span>
            
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-coastal-100 text-coastal-900 px-3 py-1 rounded-full">
                Category: {categories.find(c => c.slug === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-xs bg-coastal-100 text-coastal-900 px-3 py-1 rounded-full">
                Search: &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-coastal-100 text-coastal-900 px-3 py-1 rounded-full capitalize">
                Filter: {selectedFilter}
                <button onClick={() => setSelectedFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedBadge !== 'all' && (
              <span className="inline-flex items-center gap-1 text-xs bg-coastal-100 text-coastal-900 px-3 py-1 rounded-full">
                Badge: {selectedBadge}
                <button onClick={() => setSelectedBadge('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {priceRange < 10000 && (
              <span className="inline-flex items-center gap-1 text-xs bg-coastal-100 text-coastal-900 px-3 py-1 rounded-full">
                Under {formatZAR(priceRange)}
                <button onClick={() => setPriceRange(10000)}><X className="w-3 h-3" /></button>
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1 text-xs bg-coastal-100 text-coastal-900 px-3 py-1 rounded-full">
                In Stock Only
                <button onClick={() => setOnlyInStock(false)}><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-coastal-700 hover:text-coastal-950 underline font-semibold ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            
            {/* Categories Menu */}
            <div className="bg-white rounded-2xl p-5 border border-sand-200 shadow-soft">
              <h3 className="font-serif text-base font-bold text-driftwood-950 mb-4 pb-2 border-b border-sand-100">
                Departments
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition text-left",
                      selectedCategory === 'all'
                        ? "bg-coastal-900 text-sand-50"
                        : "text-driftwood-700 hover:bg-sand-100"
                    )}
                  >
                    <span>All Products</span>
                    <span className="text-[11px] opacity-75">{products.length}</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const count = products.filter(p => p.categorySlug === cat.slug).length;
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition text-left",
                          selectedCategory === cat.slug
                            ? "bg-coastal-900 text-sand-50 font-semibold"
                            : "text-driftwood-700 hover:bg-sand-100"
                        )}
                      >
                        <span className="line-clamp-1">{cat.name}</span>
                        <span className="text-[11px] opacity-75 ml-1">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Filter Slider */}
            <div className="bg-white rounded-2xl p-5 border border-sand-200 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-base font-bold text-driftwood-950">
                  Price Limit
                </h3>
                <span className="text-xs font-bold text-coastal-800">
                  Up to {formatZAR(priceRange)}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="10000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-coastal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-driftwood-400 mt-1">
                <span>R 300</span>
                <span>R 10,000+</span>
              </div>
            </div>

            {/* Badges / Origins */}
            <div className="bg-white rounded-2xl p-5 border border-sand-200 shadow-soft">
              <h3 className="font-serif text-base font-bold text-driftwood-950 mb-3 pb-2 border-b border-sand-100">
                Origin & Specialty
              </h3>
              <div className="space-y-2 text-xs">
                {['Handmade', 'Best Seller', 'New'].map((badge) => (
                  <label key={badge} className="flex items-center gap-2 cursor-pointer text-driftwood-700 hover:text-driftwood-950">
                    <input
                      type="radio"
                      name="badgeFilter"
                      checked={selectedBadge === badge}
                      onChange={() => setSelectedBadge(selectedBadge === badge ? 'all' : badge)}
                      className="accent-coastal-700"
                    />
                    <span>{badge}</span>
                  </label>
                ))}
                {selectedBadge !== 'all' && (
                  <button
                    onClick={() => setSelectedBadge('all')}
                    className="text-[11px] text-coastal-700 hover:underline pt-1"
                  >
                    Clear specialty filter
                  </button>
                )}
              </div>
            </div>

            {/* Store In-Stock Availability */}
            <div className="bg-white rounded-2xl p-5 border border-sand-200 shadow-soft">
              <h3 className="font-serif text-base font-bold text-driftwood-950 mb-3 pb-2 border-b border-sand-100">
                Availability
              </h3>
              <label className="flex items-center gap-2 text-xs text-driftwood-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-sand-300 text-coastal-700 accent-coastal-700"
                />
                <span>In Stock at Our Showrooms</span>
              </label>
            </div>

          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 shadow-soft space-y-4">
                <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-driftwood-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-driftwood-900">
                  {products.length === 0 ? 'Catalog Updating' : 'No matching products found'}
                </h3>
                <p className="text-xs sm:text-sm text-driftwood-500 max-w-md mx-auto">
                  {products.length === 0
                    ? 'Our online catalogue is currently being prepared with artisan coastal décor and homeware. Please check back soon or visit our Gansbaai showroom.'
                    : 'We couldn’t find any items matching your active filter criteria. Try clearing some filters or searching for another term.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-semibold px-6 py-3 rounded-xl transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className={cn(
                "grid gap-6",
                columns === 4
                  ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sand-200 mb-6">
                <h3 className="font-serif text-lg font-bold text-driftwood-950">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-driftwood-500 hover:text-driftwood-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('all'); setMobileFiltersOpen(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium",
                      selectedCategory === 'all' ? "bg-coastal-900 text-white font-semibold" : "text-driftwood-700 hover:bg-sand-100"
                    )}
                  >
                    All Collections
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.slug); setMobileFiltersOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-xs font-medium",
                        selectedCategory === c.slug ? "bg-coastal-900 text-white font-semibold" : "text-driftwood-700 hover:bg-sand-100"
                      )}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sand-700 mb-2">Price Limit ({formatZAR(priceRange)})</h4>
                <input
                  type="range"
                  min="300"
                  max="10000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-coastal-700"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-sand-200 space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-3 bg-coastal-800 text-white rounded-xl text-xs font-semibold"
              >
                Show {filteredProducts.length} Results
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 bg-sand-100 text-driftwood-800 rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
