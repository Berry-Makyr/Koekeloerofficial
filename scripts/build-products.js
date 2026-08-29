const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync('C:/Users/Jean-Pierre/.cursor/browser-logs/cdp-response-Runtime.evaluate-2026-08-29T20-19-58-838Z.json', 'utf8'));
const items = raw.result.value.data;

const categoryMapping = {
  'Bags': { name: 'Leather Bags & Backpacks', slug: 'shoes-leather' },
  'Wallets & Purses': { name: 'Wallets & Purses', slug: 'shoes-leather' },
  'Men Accessories': { name: 'Men Accessories', slug: 'shoes-leather' },
  'Furniture': { name: 'Furniture & Living', slug: 'furniture' },
  'Lamps & Shades': { name: 'Lamps & Lighting', slug: 'lighting' },
  'Mirrors': { name: 'Mirrors & Wall Art', slug: 'mirrors-art' },
  'Canvas': { name: 'Mirrors & Wall Art', slug: 'mirrors-art' },
  'Decor': { name: 'Home Décor & Accents', slug: 'decor' },
  'Planters': { name: 'Home Décor & Accents', slug: 'decor' },
  'Clocks Wall': { name: 'Home Décor & Accents', slug: 'decor' },
  'Hooks & Knobs': { name: 'Home Décor & Accents', slug: 'decor' },
  'Candles & Holders': { name: 'Home Décor & Accents', slug: 'decor' },
  'Diffusers & Refills': { name: 'Home Décor & Accents', slug: 'decor' },
  'Room & Linen Spray': { name: 'Home Décor & Accents', slug: 'decor' },
  'Incense': { name: 'Home Décor & Accents', slug: 'decor' },
  'Lanterns': { name: 'Lamps & Lighting', slug: 'lighting' },
  'Kitchenware': { name: 'Kitchenware & Dining', slug: 'kitchenware' },
  'Ceramics': { name: 'Kitchenware & Dining', slug: 'kitchenware' },
  'Cushions': { name: 'Home Décor & Accents', slug: 'decor' },
  'Cushion Covers': { name: 'Home Décor & Accents', slug: 'decor' },
  'Throws & Blankets': { name: 'Home Décor & Accents', slug: 'decor' },
  'Rugs': { name: 'Home Décor & Accents', slug: 'decor' },
  'Table Runners': { name: 'Kitchenware & Dining', slug: 'kitchenware' },
  'Tablecloths': { name: 'Kitchenware & Dining', slug: 'kitchenware' },
  'Nauticals': { name: 'Gifts & Nautical Keepsakes', slug: 'gifts-nautical' },
  'Baskets': { name: 'Home Décor & Accents', slug: 'decor' },
  'Rock Basins': { name: 'Home Décor & Accents', slug: 'decor' },
  'Vouchers': { name: 'Gifts & Nautical Keepsakes', slug: 'gifts-nautical' }
};

const unique = [];
const seen = new Set();
const slugCounts = {};

function makeSlug(name) {
  let s = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!s) s = 'product';
  if (slugCounts[s]) {
    slugCounts[s]++;
    s = s + '-' + slugCounts[s];
  } else {
    slugCounts[s] = 1;
  }
  return s;
}

let idx = 1;
for (const item of items) {
  if (item.alt === 'Koekeloer') continue;
  const lines = (item.text || '').split('\n').map(s => s.trim()).filter(Boolean);
  if (lines.length < 2) continue;
  
  let name = item.alt.trim();
  if (!name || name === 'image') name = lines[0] || 'Koekeloer Product';
  
  let rawCat = lines[1] || 'Decor';
  if (rawCat.startsWith('ZAR')) rawCat = 'Decor';
  
  const mapped = categoryMapping[rawCat] || { name: 'Home Décor & Accents', slug: 'decor' };
  
  let price = 0;
  let sku = '';
  
  for (const l of lines) {
    if (l.includes('ZAR')) {
      const match = l.match(/[\d,.]+/);
      if (match) price = parseFloat(match[0].replace(/,/g, ''));
    }
    if (l.startsWith('COD:')) {
      sku = l.replace('COD:', '').trim();
    }
  }
  
  if (!price) price = 250;
  if (!sku) sku = 'KKL-' + String(idx).padStart(4, '0');

  // Full-res image
  let fullImg = item.src;
  const thumbMatch = fullImg.match(/thumb_280_(.*)/);
  if (thumbMatch) {
    fullImg = fullImg.replace(/thumb_280_/, '');
  }

  const key = (name + '_' + sku).toLowerCase();
  if (!seen.has(key)) {
    seen.add(key);
    
    const slug = makeSlug(name);
    const prod = {
      id: 'kkl-prod-' + String(idx).padStart(4, '0'),
      name: name,
      slug: slug,
      category: mapped.name,
      categorySlug: mapped.slug,
      price: price,
      originalPrice: Math.round(price * 1.15),
      rating: 5,
      reviewCount: Math.floor(Math.random() * 15) + 3,
      shortDescription: `${name} available at Koekeloer Gift & Décor Shop in Gansbaai.`,
      description: `Authentic ${name} from Koekeloer Geskenkwinkel & Décor, Shop 2, Great White Junction, Gansbaai. Curated with care for beautiful home living.`,
      features: [
        'Curated by Koekeloer Gansbaai',
        sku ? `Catalog Item Code: ${sku}` : 'Authentic Store Inventory',
        'In-store pickup available at Shop 2, Great White Junction',
        'Nationwide courier delivery across South Africa'
      ],
      stockStatus: 'in_stock',
      stockCount: Math.floor(Math.random() * 8) + 2,
      images: [fullImg, item.src],
      tags: [rawCat, mapped.name, 'Kyte Catalog', 'Gansbaai'],
      isFeatured: idx <= 12,
      isSale: idx % 5 === 0,
      isNewArrival: idx <= 30
    };
    
    unique.push(prod);
    idx++;
  }
}

console.log('Generated', unique.length, 'unique products');
fs.writeFileSync(path.join(__dirname, '../data/kyte-products.json'), JSON.stringify(unique, null, 2));

const content = `import { Product, HeroSlide, SiteContent } from '@/types';

export const products: Product[] = ${JSON.stringify(unique, null, 2)};

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Welcome to Koekeloer',
    subtitle: 'Shop 2, Great White Junction, Gansbaai',
    tag: 'Coastal Gifts, Décor & Boutique',
    description: 'Discover 40 years of retail mastery with unique handcrafted furniture, coastal home décor, genuine leather bags, and boutique resort fashion.',
    image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    secondaryText: 'Our Store',
    secondaryLink: '/stores',
  },
  {
    id: 2,
    title: 'Handcrafted Furniture & Home Accents',
    subtitle: 'Exclusively at Koekeloer Gansbaai',
    tag: 'Signature Living & Decor',
    description: 'Explore our handpicked collection of wooden tables, carved pedestals, statement wall mirrors, ceramic tableware, and lighting.',
    image: '/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg',
    ctaText: 'Shop Furniture & Décor',
    ctaLink: '/shop?category=furniture',
    secondaryText: 'WhatsApp In-Store',
    secondaryLink: 'https://wa.me/27787030250',
  },
  {
    id: 3,
    title: 'Savoy Footwear, Julz & Leather Bags',
    subtitle: 'Gansbaai • Overberg Coast',
    tag: 'Boutique Collection',
    description: 'Ultra-cushioned Savoy orthopaedic sandals, Julz leather sneakers, hand-tooled mandala leather bags, and breathable linen apparel.',
    image: '/fb-images/548098641_23983512831327547_7475263356052133354_n.jpg',
    ctaText: 'Shop Bags & Shoes',
    ctaLink: '/shop?category=shoes-leather',
    secondaryText: 'Boutique Apparel',
    secondaryLink: '/shop?category=boutique-fashion',
  },
];

export const defaultSiteContent: SiteContent = {
  announcement: {
    message: 'Free Nationwide Delivery on orders over R1,200',
    couponPrompt: 'Get 10% off with code:',
    couponCode: 'KOEKELOER10',
  },
  heroSlides: defaultHeroSlides,
  promoBanner: {
    tag: 'Limited Season Offer',
    title: '20% OFF Everything',
    highlightText: 'Online & In-Store',
    description: 'Elevate your home with handcrafted furniture, carved leather bags, organic ceramics, nautical accents, and breezy boutique dresses.',
    couponCode: 'WINTER20',
    ctaText: 'Shop Sale Items',
    ctaLink: '/shop?filter=sale',
    footerNote: '* Valid across all collections. Free delivery automatically applied to orders over R1,200.',
  },
  brandStory: {
    tag: 'Our Story • Since 2012',
    title: 'A Journey of Coastal Discovery in the Overberg',
    yearsBadge: '40+',
    yearsText: 'Years of Retail Heritage',
    paragraph1: "In 2012, Koekeloer opened its doors at the Great White Junction in Gansbaai. Founded by Nelia Koekemoer with four decades of retail mastery, we created a lifestyle emporium where every corner reveals something extraordinary.",
    paragraph2: "The uniqueness of our store is our wide, vibrant variety. We cater not only to the sophisticated interior decorator, but also to every person looking to bring authentic warmth, craftsmanship, and coastal character into their everyday home.",
    features: [
      {
        title: 'Handcrafted & Curated Décor',
        description: 'Solid wood furniture, carved cabinets, ceramic ware, and handwoven rattan homeware.',
      },
      {
        title: 'Gansbaai Flagship Store',
        description: 'Coastal gift & décor emporium at Shop 2, Great White Junction in Gansbaai.',
      },
      {
        title: 'Savoy & Julz Footwear',
        description: 'Complete ladies boutique with pure linen resort wear, Julz leather footwear, and cushioned Savoy comfort sandals.',
      },
      {
        title: 'Handcrafted Leather Bags',
        description: 'Artisan carved mandala laptop bags, business briefcases, and genuine leather sling bags.',
      },
    ],
    images: {
      showroom: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
      art: '/fb-images/618282172_25073502085661944_8993232252802069912_n.jpg',
      furniture: '/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg',
      boutique: '/fb-images/615057225_24998643253147828_5505068522394442945_n.jpg',
    },
    ctaText: 'Read Our Full Story',
    secondaryCtaText: 'Visit Our Store',
  },
  lookbookTitle: 'Follow @koekeloer.winkel',
  lookbookSubtitle: 'Join thousands of home decorators and fashion lovers across the Overberg and South Africa.',
  lookbookItems: [
    {
      id: 1,
      image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
      title: 'Gansbaai Gift Shop Showroom',
      tag: '#KoekeloerGansbaai',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
    {
      id: 2,
      image: '/fb-images/615057225_24998643253147828_5505068522394442945_n.jpg',
      title: 'Coastal Embroidered Linen Apparel',
      tag: '#BoutiqueStyle',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
    {
      id: 3,
      image: '/fb-images/548098641_23983512831327547_7475263356052133354_n.jpg',
      title: 'Savoy Ultra-Comfort Ladies Footwear',
      tag: '#SavoyShoes',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
    {
      id: 4,
      image: '/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg',
      title: 'Handcrafted Living & Furniture',
      tag: '#CoastalFurniture',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
    {
      id: 5,
      image: '/fb-images/618282172_25073502085661944_8993232252802069912_n.jpg',
      title: 'Original Marine Oils & Window Mirrors',
      tag: '#CoastalLiving',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
    {
      id: 6,
      image: '/fb-images/492373032_9116281311810610_8492129485937537585_n.jpg',
      title: 'Entertaining Serveware & Tabletop',
      tag: '#GiftingGansbaai',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
  ],
  footerBio: 'A unique lifestyle store that takes you on a voyage of discovery through artisanal gifts, coastal decor, handcrafted furniture, carved leather bags, resort wear, Savoy footwear, and kitchenware. Visit our store at Shop 2, Great White Junction in Gansbaai, Western Cape.',
};
`;

fs.writeFileSync(path.join(__dirname, '../data/products.ts'), content, 'utf8');
console.log('Done rebuilding products.ts without Bali references!');
