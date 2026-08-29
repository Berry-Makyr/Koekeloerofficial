import { StoreLocation, Review } from '@/types';

export const stores: StoreLocation[] = [
  {
    id: 'gansbaai-main',
    name: 'Koekeloer Geskenkwinkel & Décor',
    town: 'Gansbaai',
    address: 'Shop 2, Great White Junction, Main Road',
    complex: 'Great White Junction Shopping Centre',
    phone: '+27 (0)78 703 0250',
    whatsapp: '27787030250',
    email: 'info@koekeloer.co.za',
    hours: {
      weekdays: '09:00 – 17:00',
      saturday: '08:30 – 14:00',
      sunday: '09:00 – 13:00 (In Season)',
      publicHolidays: '09:00 – 13:00',
    },
    features: [
      'Artisanal Coastal Gifts, Décor & Nautical Accents',
      'Handcrafted Bali Teak Furniture & Statement Mirrors',
      'Boutique Ladies Apparel & Savoy Comfort Footwear',
      'Chalk Paint, Craft Supplies & Personal Gifting Advice',
      'Free In-Store Collection for Online Orders',
    ],
    mapEmbedUrl: 'https://maps.google.com/maps?q=Shop%202,%20Great%20White%20Junction,%20Gansbaai,%207220&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
  },
];

export const customerReviews: Review[] = [
  {
    id: 'rev-01',
    author: 'Annelize van der Merwe',
    location: 'Hermanus',
    rating: 5,
    date: '14 August 2026',
    title: 'An absolute gem of a store in Gansbaai!',
    comment: 'Koekeloer is always our first stop when visiting Gansbaai. The quality of the hand-carved Bali cabinets, coastal decor, and gifts is exceptional, and the team is so warm and welcoming. Delivery was fast and beautifully packaged.',
    verified: true,
  },
  {
    id: 'rev-02',
    author: 'Liezel Bester',
    location: 'Cape Town',
    rating: 5,
    date: '28 July 2026',
    title: 'Savoy comfort shoes feel like walking on clouds',
    comment: 'I discovered the Savoy comfort footwear at Koekeloer in Gansbaai. They provide incredible cushioning and all-day arch support! Wonderful service and a gorgeous selection of natural resort clothing and gifts.',
    verified: true,
  },
  {
    id: 'rev-03',
    author: 'Johan & Marise du Plessis',
    location: 'Gansbaai',
    rating: 5,
    date: '02 July 2026',
    title: 'Transformed our coastal beach house',
    comment: 'Nelia and the Koekeloer team helped us select seashell chandeliers, mirrors, and embroidered mandala cushions for our coastal home. Stunning statement pieces that bring genuine warmth and ocean charm to every room.',
    verified: true,
  },
];
