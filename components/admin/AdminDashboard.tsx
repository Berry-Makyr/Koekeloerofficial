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
  Store
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { Product } from '@/types';
import { categories } from '@/data/categories';
import { formatZAR, cn } from '@/lib/utils';

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

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
    features: ['Handgemaakte gehalte', 'Beskikbaar by Gansbaai vertoonlokaal'],
    dimensions: '',
    materials: '',
    origin: 'Koekeloer Uitgesoek',
    stockStatus: 'in_stock',
    stockCount: 10,
    images: ['/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg'],
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
        images: cleanImages.length > 0 ? cleanImages : ['/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg'],
      };
      addProduct(newProduct);
    }

    setIsModalOpen(false);
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
              <span>Koekeloer Winkel Kataloog</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-driftwood-950">
              Kataloog & Produk Bestuurder
            </h1>
            <p className="text-xs sm:text-sm text-driftwood-600 mt-1">
              Voeg nuwe produkte by, verwyder uitverkoopte items, of verander pryse en foto&apos;s vinnig en maklik.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/shop"
              className="px-4 py-2.5 bg-white hover:bg-sand-100 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 shadow-sm flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Kyk na Winkel</span>
            </Link>

            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 bg-white hover:bg-sand-100 text-driftwood-800 text-xs font-semibold rounded-xl border border-sand-300 shadow-sm flex items-center gap-1.5 transition"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Gekopieer!' : 'Kopieer Kataloog JSON'}</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-coastal-800 hover:bg-coastal-900 text-white text-xs font-bold rounded-xl shadow-lift flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Voeg Nuwe Item By</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
            <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
              <span>Totale Lysings</span>
              <Package className="w-4 h-4 text-coastal-700" />
            </div>
            <span className="font-serif text-2xl font-bold text-driftwood-950">{products.length}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
            <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
              <span>In Voorraad</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-serif text-2xl font-bold text-emerald-800">
              {products.filter((p) => p.stockStatus === 'in_stock').length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
            <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
              <span>Tuisblad Uitgesoek</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <span className="font-serif text-2xl font-bold text-amber-900">
              {products.filter((p) => p.isFeatured).length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft">
            <div className="flex items-center justify-between text-driftwood-500 text-xs mb-1">
              <span>Spesiale Aanbiedinge</span>
              <Tag className="w-4 h-4 text-terracotta-600" />
            </div>
            <span className="font-serif text-2xl font-bold text-terracotta-800">
              {products.filter((p) => p.isSale || p.originalPrice).length}
            </span>
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
              placeholder="Soek produkte volgens naam..."
              className="w-full bg-sand-50 border border-sand-300 rounded-xl pl-9 pr-4 py-2 text-xs text-driftwood-900 focus:outline-none focus:border-coastal-700"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-driftwood-500">Departement:</span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-sand-50 border border-sand-300 text-driftwood-900 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-coastal-700"
            >
              <option value="all">Alle Departemente</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              if (confirm('Herstel die produkte na die verstek lys? Enige nuwe items wat nie gestoor is nie sal herstel word.')) {
                resetProducts();
              }
            }}
            className="text-xs text-driftwood-500 hover:text-terracotta-600 flex items-center gap-1 font-medium ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Herstel Verstek Produkte</span>
          </button>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-100/60 border-b border-sand-200 text-[11px] font-bold uppercase tracking-wider text-driftwood-600">
                  <th className="p-4 pl-6">Produk & Foto</th>
                  <th className="p-4">Departement</th>
                  <th className="p-4">Prys (ZAR)</th>
                  <th className="p-4">Voorraad</th>
                  <th className="p-4 text-center">Tuisblad</th>
                  <th className="p-4 text-center">Afslag</th>
                  <th className="p-4 pr-6 text-right">Aksies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-xs">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-driftwood-500">
                      Geen produkte gevind nie.
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
                          {p.stockStatus === 'in_stock' ? '✓ In Voorraad' : '✗ Uitverkoop'}
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
                            title="Wysig Produk"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Is jy seker jy wil "${p.name}" verwyder?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-2 rounded-lg text-driftwood-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Verwyder Produk"
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
                {editingProduct ? `Wysig: ${editingProduct.name}` : 'Nuwe Produk Lysing'}
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
                <label className="block font-semibold text-driftwood-800 mb-1">Produk Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="bv. Bali Handgesnede Teakhout Dressoir"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Departement *</label>
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
                  <label className="block font-semibold text-driftwood-800 mb-1">Prys (ZAR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="bv. 1450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Oorspronklike Prys (Opsioneel vir afslag)</label>
                  <input
                    type="number"
                    placeholder="bv. 1850"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-driftwood-800 mb-1">Oorsprong</label>
                  <input
                    type="text"
                    placeholder="bv. Handgemaak in Bali / Gansbaai"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-3 bg-sand-50 border border-sand-300 rounded-xl focus:border-coastal-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URLs Input */}
              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">
                  Foto Skakel (/fb-images/... of web skakel) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg"
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
                      alt="Voorskou"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-driftwood-900 block">Foto Voorskou</span>
                    <span className="text-[10px] text-emerald-700">Foto suksesvol gelaai</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-driftwood-800 mb-1">Beskrywing *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Beskryf die produk se materiaal, afmetings en styl..."
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
                  <span className="font-semibold text-driftwood-800">Tuisblad Uitgesoek</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival || false}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-sage-700"
                  />
                  <span className="font-semibold text-driftwood-800">Nuut Aangekom</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSale || false}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="accent-terracotta-600"
                  />
                  <span className="font-semibold text-driftwood-800">Spesiale Aanbod</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-sand-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-sand-300 text-driftwood-700 font-semibold hover:bg-sand-100"
                >
                  Kanselleer
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-coastal-800 hover:bg-coastal-900 text-white font-bold shadow-sm"
                >
                  {editingProduct ? 'Stoor Wysigings' : 'Publiseer Produk'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
