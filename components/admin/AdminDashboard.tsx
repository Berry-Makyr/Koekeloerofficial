'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  Copy, 
  ExternalLink, 
  Package, 
  Tag, 
  Store,
  Layers,
  Sliders,
  Image as ImageIcon,
  Save,
  Megaphone,
  BookOpen,
  Camera,
  Grid,
  ShoppingBag,
  Truck,
  UserCheck,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { Product, Category, HeroSlide, LookbookItem } from '@/types';
import { formatZAR, cn } from '@/lib/utils';

type AdminTab = 'products' | 'categories' | 'sections' | 'orders';
type SectionSubTab = 'hero' | 'promo' | 'story' | 'lookbook' | 'announcement';

export default function AdminDashboard({ currentUser }: { currentUser?: any }) {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProducts,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategories,
    siteContent,
    updateSiteContent,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    updateLookbookItem,
    resetSiteContent
  } = useShop();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [activeSectionSubTab, setActiveSectionSubTab] = useState<SectionSubTab>('hero');

  // Product State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const showSavedAlert = (msg: string) => {
    setSavedSuccessMsg(msg);
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  const initialProductState: Omit<Product, 'id'> = {
    name: '',
    slug: '',
    category: categories[0]?.name || 'Home Décor & Accents',
    categorySlug: categories[0]?.slug || 'decor',
    price: 495,
    originalPrice: undefined,
    rating: 5.0,
    reviewCount: 1,
    description: '',
    shortDescription: '',
    features: ['Handcrafted quality', 'Available in our Gansbaai showroom'],
    dimensions: '',
    materials: '',
    origin: 'Koekeloer Collection',
    stockStatus: 'in_stock',
    stockCount: 10,
    images: ['/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg'],
    badges: ['New'],
    tags: ['decor', 'gansbaai'],
    isFeatured: true,
    isSale: false,
    isNewArrival: true,
  };

  const [productFormData, setProductFormData] = useState<Omit<Product, 'id'>>(initialProductState);
  const [productImageUrlInput, setProductImageUrlInput] = useState('');

  // Category State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const initialCategoryState: Omit<Category, 'id'> = {
    name: '',
    slug: '',
    description: '',
    image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
    itemCount: 10,
    featured: true,
  };
  const [categoryFormData, setCategoryFormData] = useState<Omit<Category, 'id'>>(initialCategoryState);

  // Orders State
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setAdminOrders(data.orders || []);
      }
    } catch (e) {
      console.error('Error fetching admin orders:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  // Section Form Local Edits
  const emptyPromo = {
    tag: '',
    title: '',
    highlightText: '',
    description: '',
    couponCode: '',
    ctaText: '',
    ctaLink: '',
    footerNote: '',
  };
  const [localPromo, setLocalPromo] = useState(siteContent.promoBanner ?? emptyPromo);
  const [localAnnouncement, setLocalAnnouncement] = useState(siteContent.announcement);
  const [localStory, setLocalStory] = useState(siteContent.brandStory);
  const [localLookbookTitle, setLocalLookbookTitle] = useState(siteContent.lookbookTitle);
  const [localLookbookSubtitle, setLocalLookbookSubtitle] = useState(siteContent.lookbookSubtitle);

  // Keep local section states updated if siteContent changes from reset
  React.useEffect(() => {
    setLocalPromo(siteContent.promoBanner ?? emptyPromo);
    setLocalAnnouncement(siteContent.announcement);
    setLocalStory(siteContent.brandStory);
    setLocalLookbookTitle(siteContent.lookbookTitle);
    setLocalLookbookSubtitle(siteContent.lookbookSubtitle);
  }, [siteContent]);

  // Product Filter
  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter !== 'all' && p.categorySlug !== selectedCategoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Open Product Modal
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      ...initialProductState,
      category: categories[0]?.name || 'Home Décor & Accents',
      categorySlug: categories[0]?.slug || 'decor',
    });
    setProductImageUrlInput(initialProductState.images[0] || '');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({ ...product });
    setProductImageUrlInput(product.images.join('\n'));
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanImages = productImageUrlInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const generatedSlug = productFormData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const categoryObj = categories.find((c) => c.slug === productFormData.categorySlug);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productFormData,
        category: categoryObj?.name || productFormData.category,
        slug: generatedSlug || editingProduct.slug,
        images: cleanImages.length > 0 ? cleanImages : productFormData.images,
      });
      showSavedAlert(`Updated product "${productFormData.name}"`);
    } else {
      const newId = `kkl-custom-${Date.now()}`;
      const newProduct: Product = {
        ...productFormData,
        id: newId,
        category: categoryObj?.name || productFormData.category,
        slug: generatedSlug || `product-${Date.now()}`,
        images: cleanImages.length > 0 ? cleanImages : ['/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg'],
      };
      addProduct(newProduct);
      showSavedAlert(`Created new product "${newProduct.name}"`);
    }

    setIsProductModalOpen(false);
  };

  // Open Category Modal
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData(initialCategoryState);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFormData({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();

    const generatedSlug = categoryFormData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        ...categoryFormData,
        slug: generatedSlug || editingCategory.slug,
      });
      showSavedAlert(`Updated category "${categoryFormData.name}"`);
    } else {
      const newId = generatedSlug || `cat-${Date.now()}`;
      const newCategory: Category = {
        ...categoryFormData,
        id: newId,
        slug: generatedSlug || newId,
      };
      addCategory(newCategory);
      showSavedAlert(`Created new category "${newCategory.name}"`);
    }

    setIsCategoryModalOpen(false);
  };

  const handleExportJSON = () => {
    const data = {
      products,
      categories,
      siteContent,
    };
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard?.writeText(jsonString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="bg-sand-50/70 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-coastal-700 mb-1">
              <Store className="w-4 h-4 text-coastal-600" />
              <span>Koekeloer Control Center</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950">
              Admin & Content Manager
            </h1>
            <p className="text-xs sm:text-sm text-driftwood-600 mt-1">
              Manage products, organize departments, and customize website banners, text, and imagery.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {currentUser && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-950 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Signed in as <strong>{currentUser.firstName} ({currentUser.role})</strong></span>
              </div>
            )}

            <Link
              href="/shop"
              className="px-4 py-2.5 bg-white hover:bg-sand-100 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 shadow-sm flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 bg-white hover:bg-sand-100 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 shadow-sm flex items-center gap-1.5 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied Full Backup!' : 'Export JSON Backup'}</span>
            </button>

            <button
              onClick={async () => {
                await fetch('/api/admin/auth/logout', { method: 'POST' });
                window.location.href = '/admin/login';
              }}
              className="px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 shadow-sm flex items-center gap-1.5 transition"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Save Alert */}
        {savedSuccessMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-soft animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-sand-200 shadow-soft mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200",
              activeTab === 'products'
                ? "bg-coastal-900 text-white shadow-sm"
                : "text-driftwood-600 hover:text-driftwood-950 hover:bg-sand-50"
            )}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200",
              activeTab === 'categories'
                ? "bg-coastal-900 text-white shadow-sm"
                : "text-driftwood-600 hover:text-driftwood-950 hover:bg-sand-50"
            )}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); fetchOrders(); }}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200",
              activeTab === 'orders'
                ? "bg-coastal-900 text-white shadow-sm"
                : "text-driftwood-600 hover:text-driftwood-950 hover:bg-sand-50"
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Shipments ({adminOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition duration-200",
              activeTab === 'sections'
                ? "bg-coastal-900 text-white shadow-sm"
                : "text-driftwood-600 hover:text-driftwood-950 hover:bg-sand-50"
            )}
          >
            <Sliders className="w-4 h-4" />
            <span>Website Sections & Banners</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCTS MANAGEMENT                                               */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
                <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
                  <span>Total Listings</span>
                  <Package className="w-4 h-4 text-coastal-700" />
                </div>
                <span className="font-serif text-2xl font-bold text-driftwood-950">{products.length}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
                <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
                  <span>In Stock</span>
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="font-serif text-2xl font-bold text-emerald-800">
                  {products.filter((p) => p.stockStatus === 'in_stock').length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
                <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
                  <span>Featured on Home</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <span className="font-serif text-2xl font-bold text-amber-900">
                  {products.filter((p) => p.isFeatured).length}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
                <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
                  <span>Special Offers / Sale</span>
                  <Tag className="w-4 h-4 text-terracotta-600" />
                </div>
                <span className="font-serif text-2xl font-bold text-terracotta-800">
                  {products.filter((p) => p.isSale || p.originalPrice).length}
                </span>
              </div>
            </div>

            {/* Controls Toolbar */}
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-sand-200 flex flex-wrap items-center justify-between gap-4">
              
              {/* Search */}
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title or keywords..."
                  className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-9 pr-4 py-2 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
                />
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-driftwood-500">Department:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-sand-50 border border-sand-300 text-driftwood-900 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-coastal-700"
                >
                  <option value="all">All Departments</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              {/* Reset button */}
              <button
                onClick={() => {
                  if (confirm('Reset products to default catalog? Any custom products will be reverted.')) {
                    resetProducts();
                    showSavedAlert('Products reset to default catalog.');
                  }
                }}
                className="text-xs text-driftwood-500 hover:text-terracotta-600 flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {/* Listings Table */}
            <div className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-sand-100/60 border-b border-sand-200 text-[11px] font-bold uppercase tracking-wider text-driftwood-600">
                      <th className="p-4 pl-6">Product & Photo</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Price (ZAR)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-center">Featured</th>
                      <th className="p-4 text-center">Sale</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100 text-xs">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-driftwood-500">
                          <div className="max-w-md mx-auto space-y-3">
                            <p className="font-medium text-sm text-driftwood-800">
                              {products.length === 0 ? 'No custom products added yet.' : 'No products found matching your filter.'}
                            </p>
                            <p className="text-xs text-driftwood-500">
                              {products.length === 0
                                ? 'Your catalog is clean and ready. Click the button below to add your first custom product listing.'
                                : 'Try searching for different keywords or clearing your department filter.'}
                            </p>
                            {products.length === 0 && (
                              <button
                                onClick={handleOpenAddProduct}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-bold rounded-xl shadow-sm transition"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Create First Product Listing</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-sand-50/70 transition">
                          
                          {/* Product details */}
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-sand-100 border border-sand-200 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <Link href={`/shop/${p.slug}`} className="font-bold text-driftwood-950 hover:text-coastal-700 transition">
                                  {p.name}
                                </Link>
                                <p className="text-[11px] text-driftwood-500 line-clamp-1 mt-0.5">
                                  {p.shortDescription || p.description}
                                </p>
                                {p.badges && p.badges.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {p.badges.map((b) => (
                                      <span key={b} className="text-[9px] font-bold px-1.5 py-0.2 bg-sand-200 text-driftwood-800 rounded">
                                        {b}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="p-4 text-driftwood-700 font-medium">
                            {p.category}
                          </td>

                          {/* Price */}
                          <td className="p-4">
                            <span className="font-bold text-driftwood-950">{formatZAR(p.price)}</span>
                            {p.originalPrice && (
                              <span className="block text-[10px] text-driftwood-400 line-through">
                                {formatZAR(p.originalPrice)}
                              </span>
                            )}
                          </td>

                          {/* Stock Toggle */}
                          <td className="p-4">
                            <button
                              onClick={() => {
                                updateProduct(p.id, {
                                  stockStatus: p.stockStatus === 'in_stock' ? 'out_of_stock' : 'in_stock',
                                });
                              }}
                              className={cn(
                                "px-2.5 py-1 rounded-full text-[11px] font-bold border transition",
                                p.stockStatus === 'in_stock'
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : "bg-red-50 text-red-800 border-red-300"
                              )}
                            >
                              {p.stockStatus === 'in_stock' ? '✓ In Stock' : '✗ Out of Stock'}
                            </button>
                          </td>

                          {/* Featured Toggle */}
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={p.isFeatured || false}
                              onChange={(e) => updateProduct(p.id, { isFeatured: e.target.checked })}
                              className="w-4 h-4 accent-coastal-800 cursor-pointer"
                            />
                          </td>

                          {/* Sale Toggle */}
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={p.isSale || false}
                              onChange={(e) => updateProduct(p.id, { isSale: e.target.checked })}
                              className="w-4 h-4 accent-terracotta-600 cursor-pointer"
                            />
                          </td>

                          {/* Actions */}
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 rounded-lg text-driftwood-600 hover:text-coastal-800 hover:bg-sand-200 transition"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                    showSavedAlert(`Deleted product "${p.name}"`);
                                  }
                                }}
                                className="p-2 rounded-lg text-driftwood-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CATEGORIES MANAGEMENT                                             */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-sand-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-driftwood-950">Store Departments & Categories</h3>
                <p className="text-xs text-driftwood-500">Edit category images, names, descriptions, or add new shopping departments.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (confirm('Reset categories to default departments?')) {
                      resetCategories();
                      showSavedAlert('Categories reset to defaults.');
                    }
                  }}
                  className="text-xs text-driftwood-500 hover:text-terracotta-600 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Categories</span>
                </button>

                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-soft hover:shadow-lift transition flex flex-col justify-between"
                >
                  {/* Category Image */}
                  <div className="relative h-44 w-full bg-sand-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-driftwood-950/80 backdrop-blur-sm text-sand-100 text-[10px] font-bold px-2 py-0.5 rounded">
                      slug: {cat.slug}
                    </div>
                  </div>

                  {/* Category Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif text-base font-bold text-driftwood-950">{cat.name}</h4>
                      <p className="text-xs text-driftwood-600 line-clamp-2 mt-1 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-sand-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-driftwood-500 font-medium">
                        {products.filter((p) => p.categorySlug === cat.slug).length} Products Listed
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-1.5 rounded-lg text-driftwood-700 hover:text-coastal-800 hover:bg-sand-100"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
                              deleteCategory(cat.id);
                              showSavedAlert(`Deleted category "${cat.name}"`);
                            }
                          }}
                          className="p-1.5 rounded-lg text-driftwood-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: ORDERS & SHIPMENTS MANAGEMENT                                       */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-sand-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-driftwood-950">Customer Orders & Fulfillment</h3>
                <p className="text-xs text-driftwood-500">View real-time customer purchases, tracking numbers, and update fulfillment states.</p>
              </div>

              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-sand-100 hover:bg-sand-200 text-driftwood-900 text-xs font-semibold rounded-xl border border-sand-300 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh Orders</span>
              </button>
            </div>

            {isLoadingOrders ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand-200">
                <div className="w-8 h-8 border-2 border-coastal-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-driftwood-600">Loading order records...</p>
              </div>
            ) : adminOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 shadow-soft space-y-3">
                <ShoppingBag className="w-8 h-8 text-driftwood-400 mx-auto" />
                <h4 className="font-serif text-base font-bold text-driftwood-950">No customer orders recorded yet</h4>
                <p className="text-xs text-driftwood-500 max-w-sm mx-auto">
                  When customers complete checkout, their order snapshots, customer details, and payment confirmations will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {adminOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 border border-sand-200 shadow-soft space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sand-100 gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-driftwood-950">{order.orderNumber}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[10px]">
                            {order.paymentStatus}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-coastal-50 text-coastal-900 border border-coastal-300 font-bold text-[10px]">
                            {order.fulfillmentStatus}
                          </span>
                        </div>
                        <p className="text-driftwood-500 mt-0.5">
                          Customer: <strong>{order.customerName}</strong> ({order.customerEmail} • {order.customerPhone})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-driftwood-500 block">Total Amount</span>
                        <span className="font-serif text-lg font-bold text-coastal-950">{formatZAR(order.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="divide-y divide-sand-100 text-xs">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-semibold text-driftwood-900">{item.productNameSnapshot}</span>
                            {item.variantTitleSnapshot && <span className="text-driftwood-500 ml-1.5">({item.variantTitleSnapshot})</span>}
                            <span className="text-driftwood-400 block text-[11px]">Qty: {item.quantity} × {formatZAR(item.unitPriceSnapshot)}</span>
                          </div>
                          <span className="font-bold text-driftwood-900">{formatZAR(item.totalPriceSnapshot)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Address Snapshot & Notes */}
                    <div className="p-3 bg-sand-50 rounded-xl text-xs space-y-1 text-driftwood-700">
                      <p><strong>Delivery:</strong> {order.deliveryMethod} — {order.shippingAddressSnapshot?.addressLine1}, {order.shippingAddressSnapshot?.city}, {order.shippingAddressSnapshot?.province} ({order.shippingAddressSnapshot?.postalCode})</p>
                      {order.customerNotes && <p><strong>Customer Notes:</strong> {order.customerNotes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: HOMEPAGE BANNERS & SECTIONS MANAGEMENT                             */}
        {/* ========================================================================= */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            
            {/* Sub Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-sand-200 shadow-soft">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveSectionSubTab('hero')}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition",
                    activeSectionSubTab === 'hero' ? "bg-coastal-800 text-white" : "text-driftwood-700 hover:bg-sand-100"
                  )}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Hero Slider ({siteContent.heroSlides.length})</span>
                </button>

                <button
                  onClick={() => setActiveSectionSubTab('promo')}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition",
                    activeSectionSubTab === 'promo' ? "bg-coastal-800 text-white" : "text-driftwood-700 hover:bg-sand-100"
                  )}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo Banner</span>
                </button>

                <button
                  onClick={() => setActiveSectionSubTab('story')}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition",
                    activeSectionSubTab === 'story' ? "bg-coastal-800 text-white" : "text-driftwood-700 hover:bg-sand-100"
                  )}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Brand Story & Collage</span>
                </button>

                <button
                  onClick={() => setActiveSectionSubTab('lookbook')}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition",
                    activeSectionSubTab === 'lookbook' ? "bg-coastal-800 text-white" : "text-driftwood-700 hover:bg-sand-100"
                  )}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Instagram Lookbook ({siteContent.lookbookItems.length})</span>
                </button>

                <button
                  onClick={() => setActiveSectionSubTab('announcement')}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition",
                    activeSectionSubTab === 'announcement' ? "bg-coastal-800 text-white" : "text-driftwood-700 hover:bg-sand-100"
                  )}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>Announcement Bar</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm('Reset all website banners and text sections to default content?')) {
                    resetSiteContent();
                    showSavedAlert('Website sections reset to default.');
                  }
                }}
                className="text-xs text-driftwood-500 hover:text-terracotta-600 flex items-center gap-1 font-medium px-2 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Section Defaults</span>
              </button>
            </div>

            {/* SUB-TAB: HERO SLIDER */}
            {activeSectionSubTab === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-driftwood-950">Hero Carousel Slides</h3>
                  <button
                    onClick={() => {
                      const newSlide: HeroSlide = {
                        id: Date.now(),
                        title: 'New Featured Collection',
                        subtitle: 'Exclusive coastal home accents & furniture',
                        tag: 'New Season',
                        image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
                        ctaText: 'Explore Now',
                        ctaLink: '/shop',
                        secondaryText: 'Our Stores',
                        secondaryLink: '/stores',
                      };
                      addHeroSlide(newSlide);
                      showSavedAlert('Added new hero slide.');
                    }}
                    className="px-3.5 py-2 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Hero Slide</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {siteContent.heroSlides.map((slide, index) => (
                    <div key={slide.id || index} className="bg-white rounded-3xl p-6 border border-sand-200 shadow-soft space-y-4">
                      
                      <div className="flex items-center justify-between pb-3 border-b border-sand-100">
                        <span className="font-serif text-base font-bold text-driftwood-950">
                          Slide #{index + 1}: {slide.title}
                        </span>
                        {siteContent.heroSlides.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm('Delete this hero slide?')) {
                                deleteHeroSlide(index);
                                showSavedAlert('Hero slide removed.');
                              }
                            }}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Slide</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Slide Preview & Image URL */}
                        <div className="space-y-3">
                          <label className="block text-xs font-semibold text-driftwood-800">Background Image URL</label>
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => updateHeroSlide(index, { image: e.target.value })}
                            className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs font-mono"
                          />
                          <div className="h-44 rounded-xl overflow-hidden bg-sand-200 relative border border-sand-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                              <span className="text-white text-xs font-semibold drop-shadow">{slide.title}</span>
                            </div>
                          </div>
                        </div>

                        {/* Slide Form Inputs */}
                        <div className="lg:col-span-2 space-y-3 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-semibold text-driftwood-800 mb-1">Tag / Pill Text</label>
                              <input
                                type="text"
                                value={slide.tag}
                                onChange={(e) => updateHeroSlide(index, { tag: e.target.value })}
                                className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl"
                              />
                            </div>

                            <div>
                              <label className="block font-semibold text-driftwood-800 mb-1">Main Headline *</label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => updateHeroSlide(index, { title: e.target.value })}
                                className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl font-bold"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-semibold text-driftwood-800 mb-1">Subtitle / Town locations</label>
                            <input
                              type="text"
                              value={slide.subtitle}
                              onChange={(e) => updateHeroSlide(index, { subtitle: e.target.value })}
                              className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <div className="space-y-2">
                              <label className="block font-semibold text-driftwood-800">Primary Button</label>
                              <input
                                type="text"
                                placeholder="Button Text"
                                value={slide.ctaText}
                                onChange={(e) => updateHeroSlide(index, { ctaText: e.target.value })}
                                className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl"
                              />
                              <input
                                type="text"
                                placeholder="Link URL (/shop...)"
                                value={slide.ctaLink}
                                onChange={(e) => updateHeroSlide(index, { ctaLink: e.target.value })}
                                className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl font-mono text-[11px]"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block font-semibold text-driftwood-800">Secondary Button</label>
                              <input
                                type="text"
                                placeholder="Button Text"
                                value={slide.secondaryText}
                                onChange={(e) => updateHeroSlide(index, { secondaryText: e.target.value })}
                                className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl"
                              />
                              <input
                                type="text"
                                placeholder="Link URL (/stores...)"
                                value={slide.secondaryLink}
                                onChange={(e) => updateHeroSlide(index, { secondaryLink: e.target.value })}
                                className="w-full p-2.5 bg-sand-50 border border-sand-300 rounded-xl font-mono text-[11px]"
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-TAB: PROMO BANNER */}
            {activeSectionSubTab === 'promo' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-5 text-xs">
                <div className="border-b border-sand-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-driftwood-950">Promotional Banner Section</h3>
                  <p className="text-driftwood-500">Edit the seasonal discount coupon, banner headlines, and promotion text.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={localPromo.tag}
                      onChange={(e) => setLocalPromo({ ...localPromo, tag: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={localPromo.couponCode}
                      onChange={(e) => setLocalPromo({ ...localPromo, couponCode: e.target.value.toUpperCase() })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-mono font-bold text-coastal-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Banner Title</label>
                    <input
                      type="text"
                      value={localPromo.title}
                      onChange={(e) => setLocalPromo({ ...localPromo, title: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Highlighted Sub-title</label>
                    <input
                      type="text"
                      value={localPromo.highlightText}
                      onChange={(e) => setLocalPromo({ ...localPromo, highlightText: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-bold text-sand-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={localPromo.description}
                    onChange={(e) => setLocalPromo({ ...localPromo, description: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={localPromo.ctaText}
                      onChange={(e) => setLocalPromo({ ...localPromo, ctaText: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={localPromo.ctaLink}
                      onChange={(e) => setLocalPromo({ ...localPromo, ctaLink: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Footer Note / Disclaimer</label>
                  <input
                    type="text"
                    value={localPromo.footerNote}
                    onChange={(e) => setLocalPromo({ ...localPromo, footerNote: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateSiteContent({ promoBanner: localPromo });
                    showSavedAlert('Saved Promo Banner settings!');
                  }}
                  className="px-6 py-3 bg-coastal-800 hover:bg-coastal-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Promo Banner Changes</span>
                </button>
              </div>
            )}

            {/* SUB-TAB: BRAND STORY & COLLAGE */}
            {activeSectionSubTab === 'story' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6 text-xs">
                <div className="border-b border-sand-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-driftwood-950">Brand Story & Collage Section</h3>
                  <p className="text-driftwood-500">Edit the heritage copy, 4 feature bullet points, and 4 collage photo URLs.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Years Badge (e.g. 40+)</label>
                    <input
                      type="text"
                      value={localStory.yearsBadge}
                      onChange={(e) => setLocalStory({ ...localStory, yearsBadge: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Years Label Text</label>
                    <input
                      type="text"
                      value={localStory.yearsText}
                      onChange={(e) => setLocalStory({ ...localStory, yearsText: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Section Headline</label>
                  <input
                    type="text"
                    value={localStory.title}
                    onChange={(e) => setLocalStory({ ...localStory, title: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Paragraph 1</label>
                    <textarea
                      rows={4}
                      value={localStory.paragraph1}
                      onChange={(e) => setLocalStory({ ...localStory, paragraph1: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Paragraph 2</label>
                    <textarea
                      rows={4}
                      value={localStory.paragraph2}
                      onChange={(e) => setLocalStory({ ...localStory, paragraph2: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* 4 Collage Image URLs */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-semibold text-driftwood-900">4 Story Collage Photos</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(localStory.images || {}).map(([key, imgUrl]) => (
                      <div key={key} className="space-y-2 p-3 bg-sand-50 rounded-2xl border border-sand-200">
                        <span className="font-bold capitalize text-driftwood-800 block text-[11px]">{key} Photo</span>
                        <div className="h-28 rounded-lg overflow-hidden bg-sand-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt={key} className="w-full h-full object-cover" />
                        </div>
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => setLocalStory({
                            ...localStory,
                            images: { ...localStory.images, [key]: e.target.value }
                          })}
                          className="w-full p-2 bg-white border border-sand-300 rounded-lg font-mono text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateSiteContent({ brandStory: localStory });
                    showSavedAlert('Saved Brand Story changes!');
                  }}
                  className="px-6 py-3 bg-coastal-800 hover:bg-coastal-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Brand Story Changes</span>
                </button>
              </div>
            )}

            {/* SUB-TAB: INSTAGRAM LOOKBOOK */}
            {activeSectionSubTab === 'lookbook' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-6 text-xs">
                <div className="border-b border-sand-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-driftwood-950">Instagram Lookbook Grid</h3>
                  <p className="text-driftwood-500">Edit the 6 social inspiration gallery items, images, titles, and hashtags.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Lookbook Header Title</label>
                    <input
                      type="text"
                      value={localLookbookTitle}
                      onChange={(e) => setLocalLookbookTitle(e.target.value)}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Lookbook Subtitle</label>
                    <input
                      type="text"
                      value={localLookbookSubtitle}
                      onChange={(e) => setLocalLookbookSubtitle(e.target.value)}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* 6 Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {siteContent.lookbookItems.map((item, idx) => (
                    <div key={item.id || idx} className="p-3 bg-sand-50 rounded-2xl border border-sand-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-driftwood-800 text-[11px]">Card #{idx + 1}</span>
                      </div>
                      <div className="h-32 rounded-lg overflow-hidden bg-sand-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <input
                        type="text"
                        placeholder="Image URL"
                        value={item.image}
                        onChange={(e) => updateLookbookItem(idx, { image: e.target.value })}
                        className="w-full p-2 bg-white border border-sand-300 rounded-lg font-mono text-[10px]"
                      />
                      <input
                        type="text"
                        placeholder="Title / Description"
                        value={item.title}
                        onChange={(e) => updateLookbookItem(idx, { title: e.target.value })}
                        className="w-full p-2 bg-white border border-sand-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Hashtag (e.g. #CoastalLiving)"
                        value={item.tag}
                        onChange={(e) => updateLookbookItem(idx, { tag: e.target.value })}
                        className="w-full p-2 bg-white border border-sand-300 rounded-lg text-xs text-sand-700 font-semibold"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateSiteContent({ 
                      lookbookTitle: localLookbookTitle, 
                      lookbookSubtitle: localLookbookSubtitle 
                    });
                    showSavedAlert('Saved Lookbook settings!');
                  }}
                  className="px-6 py-3 bg-coastal-800 hover:bg-coastal-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Lookbook Headers</span>
                </button>
              </div>
            )}

            {/* SUB-TAB: ANNOUNCEMENT BAR */}
            {activeSectionSubTab === 'announcement' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-soft space-y-5 text-xs">
                <div className="border-b border-sand-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-driftwood-950">Top Announcement Bar</h3>
                  <p className="text-driftwood-500">Edit the top banner text, free shipping threshold message, and top discount coupon code.</p>
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Delivery / Highlight Message</label>
                  <input
                    type="text"
                    value={localAnnouncement.message}
                    onChange={(e) => setLocalAnnouncement({ ...localAnnouncement, message: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Coupon Prompt Label</label>
                    <input
                      type="text"
                      value={localAnnouncement.couponPrompt}
                      onChange={(e) => setLocalAnnouncement({ ...localAnnouncement, couponPrompt: e.target.value })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-driftwood-800 mb-1">Top Coupon Code</label>
                    <input
                      type="text"
                      value={localAnnouncement.couponCode}
                      onChange={(e) => setLocalAnnouncement({ ...localAnnouncement, couponCode: e.target.value.toUpperCase() })}
                      className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl font-mono font-bold text-coastal-900"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateSiteContent({ announcement: localAnnouncement });
                    showSavedAlert('Saved Announcement Bar settings!');
                  }}
                  className="px-6 py-3 bg-coastal-800 hover:bg-coastal-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Announcement Bar Changes</span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT                                              */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sand-200 overflow-hidden z-10 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-sand-200 bg-sand-50 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-driftwood-950">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product Listing'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-driftwood-500 hover:text-driftwood-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hand-Carved Teak Sideboard"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Department / Category *</label>
                  <select
                    value={productFormData.categorySlug}
                    onChange={(e) => setProductFormData({ ...productFormData, categorySlug: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Price (ZAR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1450"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: Number(e.target.value) })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Original Price (For Sale Strike-through)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1850"
                    value={productFormData.originalPrice || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Origin / Craftsmanship</label>
                  <input
                    type="text"
                    placeholder="e.g. Handcrafted Local & Imported"
                    value={productFormData.origin || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, origin: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URLs Input */}
              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">
                  Photo Path or URL (/fb-images/... or web URL) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg"
                  value={productImageUrlInput}
                  onChange={(e) => setProductImageUrlInput(e.target.value)}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* Image Preview Thumbnail */}
              {productImageUrlInput.split('\n')[0]?.trim() && (
                <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl border border-sand-200">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-sand-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={productImageUrlInput.split('\n')[0]?.trim()}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-driftwood-900 block">Photo Preview</span>
                    <span className="text-[10px] text-emerald-700">Image loaded successfully</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">Full Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the product materials, dimensions, aesthetic, and features..."
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value, shortDescription: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isFeatured || false}
                    onChange={(e) => setProductFormData({ ...productFormData, isFeatured: e.target.checked })}
                    className="accent-coastal-800"
                  />
                  <span className="font-semibold text-driftwood-800">Featured on Home</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isNewArrival || false}
                    onChange={(e) => setProductFormData({ ...productFormData, isNewArrival: e.target.checked })}
                    className="accent-sage-700"
                  />
                  <span className="font-semibold text-driftwood-800">New Arrival</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productFormData.isSale || false}
                    onChange={(e) => setProductFormData({ ...productFormData, isSale: e.target.checked })}
                    className="accent-terracotta-600"
                  />
                  <span className="font-semibold text-driftwood-800">Special Sale</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-sand-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-sand-300 text-driftwood-700 font-semibold hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-coastal-800 hover:bg-coastal-900 text-white font-bold shadow-sm"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT CATEGORY                                             */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sand-200 overflow-hidden z-10 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-sand-200 bg-sand-50 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-driftwood-950">
                {editingCategory ? `Edit Department: ${editingCategory.name}` : 'Add New Category Department'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-driftwood-500 hover:text-driftwood-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Form */}
            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Furniture & Living"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">Image URL / Path (/fb-images/...) *</label>
                <input
                  type="text"
                  required
                  placeholder="/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg"
                  value={categoryFormData.image}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* Preview */}
              {categoryFormData.image && (
                <div className="h-32 rounded-xl overflow-hidden bg-sand-200 border border-sand-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={categoryFormData.image} alt="Category preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Short description of items found in this department..."
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-sand-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-sand-300 text-driftwood-700 font-semibold hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-coastal-800 hover:bg-coastal-900 text-white font-bold shadow-sm"
                >
                  {editingCategory ? 'Save Department' : 'Create Department'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
