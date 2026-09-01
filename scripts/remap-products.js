const fs = require('fs');
const path = require('path');

const RAW_TO_CATEGORY = {
  Bags: { name: 'Boutique Apparel', slug: 'boutique-apparel' },
  'Wallets & Purses': { name: 'Boutique Apparel', slug: 'boutique-apparel' },
  'Men Accessories': { name: 'Boutique Apparel', slug: 'boutique-apparel' },
  Furniture: { name: 'Furniture', slug: 'furniture' },
  'Lamps & Shades': { name: 'Lamps', slug: 'lamps' },
  Lanterns: { name: 'Lamps', slug: 'lamps' },
  Mirrors: { name: 'Mirrors', slug: 'mirrors' },
  Canvas: { name: 'Paintings', slug: 'paintings' },
  Nauticals: { name: 'Nauticals', slug: 'nauticals' },
  Vouchers: { name: 'Gifts', slug: 'gifts' },
  Kitchenware: { name: 'Kitchenware & Dining', slug: 'kitchenware-dining' },
  Ceramics: { name: 'Kitchenware & Dining', slug: 'kitchenware-dining' },
  'Table Runners': { name: 'Textiles', slug: 'textiles' },
  Tablecloths: { name: 'Textiles', slug: 'textiles' },
  Cushions: { name: 'Textiles', slug: 'textiles' },
  'Cushion Covers': { name: 'Textiles', slug: 'textiles' },
  'Throws & Blankets': { name: 'Textiles', slug: 'textiles' },
  Rugs: { name: 'Textiles', slug: 'textiles' },
  'Rock Basins': { name: 'One of a Kind', slug: 'one-of-a-kind' },
  Decor: { name: 'Décor', slug: 'decor' },
  Baskets: { name: 'Décor', slug: 'decor' },
  Planters: { name: 'Décor', slug: 'decor' },
  'Candles & Holders': { name: 'Décor', slug: 'decor' },
  'Clocks Wall': { name: 'Décor', slug: 'decor' },
  'Hooks & Knobs': { name: 'Décor', slug: 'decor' },
  'Diffusers & Refills': { name: 'Décor', slug: 'decor' },
  'Room & Linen Spray': { name: 'Décor', slug: 'decor' },
  Incense: { name: 'Décor', slug: 'decor' },
};

const productsPath = path.join(__dirname, '../data/products.ts');
const src = fs.readFileSync(productsPath, 'utf8');
const match = src.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
if (!match) throw new Error('Could not parse products array');

const products = JSON.parse(match[1]);
const counts = {};

for (const product of products) {
  const rawCat = (product.tags && product.tags[0]) || 'Decor';
  const mapped = RAW_TO_CATEGORY[rawCat] || { name: 'Décor', slug: 'decor' };
  product.category = mapped.name;
  product.categorySlug = mapped.slug;
  product.isSale = false;
  delete product.originalPrice;
  if (product.badges) {
    product.badges = product.badges.filter((b) => b !== 'Sale');
    if (product.badges.length === 0) delete product.badges;
  }
  counts[mapped.slug] = (counts[mapped.slug] || 0) + 1;
}

const updated = src.replace(
  /export const products: Product\[\] = \[[\s\S]*?\];/,
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
);

fs.writeFileSync(productsPath, updated, 'utf8');
console.log('Remapped', products.length, 'products');
console.log(JSON.stringify(counts, null, 2));
