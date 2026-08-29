const fs = require('fs');
const path = require('path');

const kyteProducts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kyte-products.json'), 'utf8'));

const content = `import { Product, HeroSlide, SiteContent } from '@/types';

export const products: Product[] = ${JSON.stringify(kyteProducts, null, 2)};

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Welcome to Koekeloer',
    subtitle: 'Shop 2, Great White Junction, Gansbaai',
    tag: 'Direct Imports & Artisan Gifts',
    description: 'Discover 40 years of retail mastery with unique handcrafted Bali teak furniture, Indian carved cabinets, genuine leather bags, and boutique resort fashion.',
    image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    secondaryText: 'Our Store',
    secondaryLink: '/stores',
  },
  {
    id: 2,
    title: 'Direct Imports from Bali & India',
    subtitle: 'Exclusively at Koekeloer Gansbaai',
    tag: 'Hand-Carved Furniture & Decor',
    description: 'Unique hand-carved credenzas, turquoise sideboards, volcanic river stone basins, and wood relief sculptures directly from master artisan ateliers.',
    image: '/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg',
    ctaText: 'Shop Furniture & Décor',
    ctaLink: '/shop?category=furniture',
    secondaryText: 'WhatsApp for Video',
    secondaryLink: 'https://wa.me/27787030250',
  },
  {
    id: 3,
    title: 'Savoy Footwear, Julz & Leather Bags',
    subtitle: 'Gansbaai • Overberg Coast',
    tag: 'Boutique Collection',
    description: 'Ultra-cushioned Savoy orthopaedic sandals, Julz leather sneakers, hand-tooled mandala leather bags, and Mediterranean linen apparel.',
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
    description: 'Elevate your home with hand-carved teak, carved leather bags, organic ceramics, marine rope mirrors, and breezy boutique dresses. Use our promo code at checkout.',
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
        title: 'Direct Bali & India Imports',
        description: 'Solid teak, carved cabinets, river stone basins, and handwoven rattan directly from master studios.',
      },
      {
        title: 'Gansbaai Flagship Store',
        description: 'Coastal gift & décor emporium at Shop 2, Great White Junction in Gansbaai.',
      },
      {
        title: 'Savoy & Julz Footwear',
        description: 'Complete ladies boutique with pure linen resort wear, Julz leather, and cushioned Savoy comfort sandals.',
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
      title: 'Handcrafted Teak & Indian Furniture',
      tag: '#BaliImports',
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
      title: 'Entertaining Serveware & Biltong Cutters',
      tag: '#GiftingGansbaai',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
  ],
  footerBio: 'A unique lifestyle store that takes you on a voyage of discovery through artisanal gifts, coastal decor, hand-carved Bali teak & Indian furniture, carved leather bags, resort wear, Savoy footwear, and kitchenware. Visit our store at Shop 2, Great White Junction in Gansbaai, Western Cape.',
};
`;

fs.writeFileSync(path.join(__dirname, '../data/products.ts'), content, 'utf8');
console.log('Done writing data/products.ts!');
