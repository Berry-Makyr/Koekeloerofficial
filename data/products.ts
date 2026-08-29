import { Product, HeroSlide, SiteContent } from '@/types';

// Default products catalog (empty - user will create their own custom listings)
export const products: Product[] = [];

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Welcome to Koekeloer',
    subtitle: 'Great White Junction, Gansbaai',
    tag: 'Fresh Stock Just Arrived',
    description: 'Discover 40 years of passion for artisanal coastal gifts, resort fashion, Savoy comfort shoes, and hand-carved Bali teak furniture.',
    image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
    ctaText: 'Explore Collections',
    ctaLink: '/shop',
    secondaryText: 'Our Store',
    secondaryLink: '/stores',
  },
  {
    id: 2,
    title: 'Direct Imports from Bali',
    subtitle: 'Exclusively at Koekeloer',
    tag: 'Limited Heirloom Pieces',
    description: 'Unique hand-carved credenzas, turquoise sideboards, river stone basins, and wood relief sculptures directly from master ateliers in Bali.',
    image: '/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg',
    ctaText: 'Shop Bali Furniture',
    ctaLink: '/shop?category=furniture',
    secondaryText: 'WhatsApp for Video',
    secondaryLink: 'https://wa.me/27787030250',
  },
  {
    id: 3,
    title: 'Savoy Comfort Footwear & Boutique',
    subtitle: 'Gansbaai • Overberg Coast',
    tag: 'Locally Loved & Stylish',
    description: 'Ultra-cushioned orthopaedic ladies sandals, soft walking shoes, and Mediterranean embroidered linen apparel for relaxed coastal living.',
    image: '/fb-images/546631879_23983512777994219_8454657023277643559_n.jpg',
    ctaText: 'Shop Footwear & Fashion',
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
    description: 'Elevate your home with hand-carved teak, organic ceramics, marine rope mirrors, and breezy boutique dresses. Use our seasonal promo code at checkout.',
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
    paragraph1: "In 2012, Koekeloer opened its doors at the Great White Junction in Gansbaai. Founded by Nelia Koekemoer with four decades of retail experience, we created a lifestyle emporium where every corner reveals something extraordinary.",
    paragraph2: "The uniqueness of our store is our wide, vibrant variety. We cater not only to the sophisticated home decorator, but also to every person looking to bring authentic warmth, craftsmanship, and coastal character into their everyday home.",
    features: [
      {
        title: 'Direct Bali Imports',
        description: 'Solid teak, river stone basins, and handwoven rattan directly from artisan studios.',
      },
      {
        title: 'Gansbaai Showroom',
        description: 'Coastal gift & décor emporium at Shop 2, Great White Junction.',
      },
      {
        title: 'Savoy Footwear & Boutique',
        description: 'Complete ladies boutique with pure linen resort wear and cushioned comfort sandals.',
      },
      {
        title: 'Community Heart',
        description: 'Regular support for local Overberg retirement homes and community charities.',
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
      image: '/fb-images/724341447_26619252904420180_7184782576607009732_n.jpg',
      title: 'Boho Mandala Canvas Cushions',
      tag: '#CoastalLiving',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
    {
      id: 5,
      image: '/fb-images/615833673_25039360082409478_6904760111975843436_n.jpg',
      title: 'Balinese Hand-Carved Teak Sideboards',
      tag: '#BaliImports',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
    {
      id: 6,
      image: '/fb-images/618282172_25073502085661944_8993232252802069912_n.jpg',
      title: 'Coastal Seagull Canvas Art',
      tag: '#SeagullArt',
      link: 'https://www.facebook.com/koekeloer.winkel',
    },
  ],
  footerBio: 'A unique lifestyle store that takes you on a voyage of discovery through artisanal gifts, coastal decor, hand-carved Bali teak furniture, resort wear, Savoy footwear, and kitchenware. Visit our showrooms at Great White Junction in Gansbaai, Western Cape.',
};

// Export heroSlides for backwards compatibility
export const heroSlides = defaultHeroSlides;
