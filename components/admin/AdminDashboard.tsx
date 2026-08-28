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
  Download, 
  Copy, 
  ExternalLink, 
  Image as ImageIcon,
  Eye,
  SlidersHorizontal,
  Package,
  TrendingUp,
  Tag,
  Store
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import { formatZAR, cn } from '@/lib/utils';

// Real sample photos from Koekeloer's Facebook page ready for 1-click insertion
export const FACEBOOK_PHOTO_PRESETS = [
  {
    title: 'Hand-Carved Balinese Credenza / Sideboard',
    url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
    category: 'Coastal & Bali Furniture',
    categorySlug: 'furniture',
    price: 7800,
    desc: 'Handgemaakte prag, ryk aan kultuur en tradisie. Hand-carved solid timber sideboard imported from artisan workshops in Bali.',
  },
  {
    title: 'Bali Hand-Carved Teakwood Bed Headboard',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
    category: 'Coastal & Bali Furniture',
    categorySlug: 'furniture',
    price: 8900,
    desc: 'Unieke erfstuk-gehalte handgesnede teakwood bedkopstuk. Eksklusief by Koekeloer Gansbaai & Struisbaai.',
  },
  {
    title: 'Solid Plantation Timber Dining & Accent Table',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
    category: 'Coastal & Bali Furniture',
    categorySlug: 'furniture',
    price: 6200,
    desc: 'Natuurlike soliede hout eetkamertafel en koffietafel met natuurlike wasafwerking.',
  },
  {
    title: 'Artisan Macramé & Shell Wall Hanging',
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200&auto=format&fit=crop',
    category: 'Home Décor & Accents',
    categorySlug: 'decor',
    price: 750,
    desc: 'Handgemaakte macramé muurhangsel met natuurlike seeskulpies en dryfhout.',
  },
  {
    title: 'Boutique Seaside Blue & White Linen Dress',
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
    category: 'Boutique Apparel & Dresses',
    categorySlug: 'boutique-fashion',
    price: 895,
    desc: 'Pragtige blou en wit patroondress perfek vir daardie seaside chic styl.',
  },
  {
    title: 'Esthé Handcrafted Genuine Leather Loafers',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop',
    category: 'Leather Shoes & Handbags',
    categorySlug: 'shoes-leather',
    price: 1150,
    desc: 'Esthé egte leerskoene - waar gerief ontmoet tydlose styl. Vervaardig in Suid-Afrika.',
  },
];

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showJsonExport, setShowJsonExport] = useState(false);

  // Form State
  const initialFormState: Omit<Product, 'id'> = {
    name: '',
    slug: '',
    category: 'Home Décor & Accents',
    categorySlug: 'decor',
    price: 495,
    originalPrice: undefined,
    rating: 5.0,
    reviewCount: 1,
    description: '',
    shortDescription: '',
    features: ['Handcrafted quality', 'Available at Gansbaai store'],
    dimensions: '',
    materials: '',
    origin: 'Koekeloer Curated',
    stockStatus: 'in_stock',
    stockCount: 10,
    images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop'],
    badges: ['New'],
    tags: ['decor', 'gansbaai'],
    isFeatured: true,
    isSale: false,
    isNewArrival: true,
  };

  const [formData, setFormData] = useState<Omit<Product, 'id'>>(initialFormState);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter !== 'all' && p.categorySlug !== selectedCategoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialFormState);
    setImageUrlInput(initialFormState.images[0] || '');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setImageUrlInput(product.images.join('\n'));
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanImages = imageUrlInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const generatedSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const categoryObj = categories.find((c) => c.slug === formData.categorySlug);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        category: categoryObj?.name || formData.category,
        slug: generatedSlug || editingProduct.slug,
        images: cleanImages.length > 0 ? cleanImages : formData.images,
      });
    } else {
      const newId = `kkl-custom-${Date.now()}`;
      const newProduct: Product = {
        ...formData,
        id: newId,
        category: categoryObj?.name || formData.category,
        slug: generatedSlug || `product-${Date.now()}`,
        images: cleanImages.length > 0 ? cleanImages : ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1000&auto=format&fit=crop'],
      };
      addProduct(newProduct);
    }

    setIsModalOpen(false);
  };

  const handleQuickInsertPreset = (preset: typeof FACEBOOK_PHOTO_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.title,
      category: preset.category,
      categorySlug: preset.categorySlug,
      price: preset.price,
      description: preset.desc,
      shortDescription: preset.desc,
      images: [preset.url],
      badges: ['Bali Import', 'New'],
    }));
    setImageUrlInput(preset.url);
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(products, null, 2);
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
              <span>Koekeloer Catalog Manager</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950">
              Quick Listings & Product Manager
            </h1>
            <p className="text-xs sm:text-sm text-driftwood-600 mt-1">
              Easily add, edit, or remove products and pictures from Facebook. Changes update the live store instantly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/shop"
              className="px-4 py-2.5 bg-white hover:bg-sand-100 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 shadow-sm flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Shop</span>
            </Link>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 bg-white hover:bg-sand-100 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 shadow-sm flex items-center gap-1.5 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Catalog Copied!' : 'Export Catalog JSON'}</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-bold rounded-xl shadow-lift flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Listing</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
              <span>Featured on Homepage</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <span className="font-serif text-2xl font-bold text-amber-900">
              {products.filter((p) => p.isFeatured).length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
            <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
              <span>On Sale</span>
              <Tag className="w-4 h-4 text-terracotta-600" />
            </div>
            <span className="font-serif text-2xl font-bold text-terracotta-800">
              {products.filter((p) => p.isSale || p.originalPrice).length}
            </span>
          </div>
        </div>

        {/* Quick Facebook Photo Insert Banner */}
        <div className="bg-gradient-to-r from-coastal-900 to-driftwood-900 text-white rounded-3xl p-6 mb-8 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-sand-300">
                1-Click Quick Add
              </span>
              <h2 className="font-serif text-xl font-bold">
                Add Items directly from Facebook Page
              </h2>
            </div>
            <a
              href="https://www.facebook.com/koekeloer.winkel/photos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sand-200 hover:text-white underline flex items-center gap-1"
            >
              <span>Open Facebook Photos Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FACEBOOK_PHOTO_PRESETS.map((preset, idx) => (
              <div
                key={idx}
                onClick={() => {
                  handleOpenAdd();
                  handleQuickInsertPreset(preset);
                }}
                className="group cursor-pointer bg-white/10 hover:bg-white/20 rounded-xl p-2.5 border border-white/10 transition flex flex-col justify-between space-y-2"
                title="Click to quickly create this listing"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-sand-100 truncate">{preset.title}</p>
                  <p className="text-[10px] text-sand-300">{formatZAR(preset.price)}</p>
                </div>
                <button className="w-full text-[10px] bg-white/20 hover:bg-white/30 text-white py-1 rounded font-semibold transition">
                  + Use Image
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-soft border border-sand-200 flex flex-wrap items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-driftwood-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings by title..."
              className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-9 pr-4 py-2 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-driftwood-500">Filter Department:</span>
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

          {/* Reset button */}
          <button
            onClick={() => {
              if (confirm('Reset catalog to default original listings? Any custom additions will be reverted.')) {
                resetProducts();
              }
            }}
            className="text-xs text-driftwood-500 hover:text-terracotta-600 flex items-center gap-1 font-medium ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
        </div>

        {/* Listings Table / Cards */}
        <div className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-100/60 border-b border-sand-200 text-[11px] font-bold uppercase tracking-wider text-driftwood-600">
                  <th className="p-4 pl-6">Product & Image</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Price (ZAR)</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-center">Sale</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-xs">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-driftwood-500">
                      No listings match your search query.
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
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 rounded-lg text-driftwood-600 hover:text-coastal-800 hover:bg-sand-200 transition"
                            title="Edit Listing"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove "${p.name}"?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-2 rounded-lg text-driftwood-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Listing"
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

      {/* Add / Edit Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sand-200 overflow-hidden z-10 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-sand-200 bg-sand-50 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-driftwood-950">
                {editingProduct ? `Edit Listing: ${editingProduct.name}` : 'Create New Product Listing'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
                  placeholder="e.g. Bali Hand-Carved Teakwood Sideboard"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Department / Category *</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Selling Price (ZAR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Original / Compare Price (Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1850 (shows discount)"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Origin / Provenance</label>
                  <input
                    type="text"
                    placeholder="e.g. Handmade in Bali / Gansbaai Local"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URLs Input */}
              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">
                  Image URLs (Paste Facebook photo link or web image URL, one per line) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="https://..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* Image Preview Thumbnail */}
              {imageUrlInput.split('\n')[0]?.trim() && (
                <div className="flex items-center gap-3 p-3 bg-sand-50 rounded-xl border border-sand-200">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-sand-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrlInput.split('\n')[0]?.trim()}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-driftwood-900 block">Image Preview</span>
                    <span className="text-[10px] text-emerald-700">Valid image link ready</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">Product Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe dimensions, texture, artisan heritage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value, shortDescription: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-coastal-800"
                  />
                  <span className="font-semibold text-driftwood-800">Featured Home</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival || false}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-sage-700"
                  />
                  <span className="font-semibold text-driftwood-800">New Arrival</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSale || false}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="accent-terracotta-600"
                  />
                  <span className="font-semibold text-driftwood-800">On Sale</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-sand-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-sand-300 text-driftwood-700 font-semibold hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-coastal-800 hover:bg-coastal-900 text-white font-bold shadow-sm"
                >
                  {editingProduct ? 'Update Listing' : 'Save & Publish Listing'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
