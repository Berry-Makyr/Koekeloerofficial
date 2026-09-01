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
      'Handcrafted Solid Wood Furniture & Statement Mirrors',
      'Handmade Carved Leather Bags & Mandala Laptop Bags',
      'Charlotte Rhys Luxury Fragrances & Traditional Boereseep',
      'Chalk Paint, Stencils & Personal Gifting Advice',
      'Free In-Store Collection for Online Orders',
    ],
    mapEmbedUrl: 'https://maps.google.com/maps?q=Shop%202,%20Great%20White%20Junction,%20Gansbaai,%207220&t=&z=16&ie=UTF8&iwloc=&output=embed',
    image: '/fb-images/606030198_24884683841210437_5271712182053158002_n.jpg',
  },
];

export const customerReviews: Review[] = [
  {
    id: 'rev-01',
    author: 'Zelna Botma',
    location: 'Gansbaai',
    rating: 5,
    date: 'Verified Google Review',
    title: 'Uitsonderlike en vriendelike diens!',
    comment: "Koekeloer Gift Shop Gansbaai het beslis personeel wat verstaan. Na 'n groot oepsie van my kant af, het hulle gewys hoe hulle moeite doen om mens te akkommodeer. Ek het my verjaarsdag-voucher verloor, maar Estelle en Ursula het in 'n japtrap saam met Nelia 'n plan gemaak om my uit my verknorsing te help. Baie dankie dat julle so baie moeite vir my gedoen het. Julle word baie waardeer.",
    verified: true,
  },
  {
    id: 'rev-02',
    author: 'Berenice Woodcock',
    location: 'Overberg',
    rating: 5,
    date: 'Verified Google Review',
    title: 'Always stunning gifts and welcoming staff',
    comment: 'I love the wonderful staff and the great choice of quality products on offer at Koekeloer Gift Shop. I always find stunning gifts and things for my home. Thank you for always making me feel welcome. Nothing is ever too much trouble.',
    verified: true,
  },
  {
    id: 'rev-03',
    author: 'Wernadine Groenewald van Rensburg',
    location: 'Gansbaai',
    rating: 5,
    date: 'Verified Google Review',
    title: '’n Werklike aanwins vir Gansbaai',
    comment: 'Koekeloer Gift Shop is ‘n werklike aanwins vir Gansbaai. Jy kan jouself verloor tussen mooi goed en daar is ‘n magiese warm atmosfeer in die winkel.',
    verified: true,
  },
  {
    id: 'rev-04',
    author: 'Anna-Marie Burger Rademan',
    location: 'Gansbaai',
    rating: 5,
    date: 'Verified Google Review',
    title: 'So baie mooi en interessante goedjies',
    comment: 'Ek was by Koekeloer Gift Shop in Gansbaai. Ek het soveel mooi en interessante goedjies gesien. Jy moet baie tyd hê om al die mooi te sien!',
    verified: true,
  },
];
