# Koekeloer E-Commerce Platform

A coastal lifestyle e-commerce web platform for **Koekeloer** (Great White Junction, Gansbaai, Western Cape, South Africa).

Inspired by the design of [beachsand.co.za](https://beachsand.co.za/), built for showcasing curated home décor, solid wood furniture, coastal mirrors, genuine leather footwear, and resort apparel.

---

## Features

- **Coastal & Warm Aesthetic**: Modeled on beachsand.co.za with responsive typography (Playfair Display & Plus Jakarta Sans), earthy driftwood/sand/coastal tones, and high-impact hero banners.
- **Full Catalog & Filtering**:
  - Filter by 8 curated departments (Decor, Furniture, Lighting, Mirrors & Art, Boutique, Leather Shoes, Kitchenware, Nautical & Gifts).
  - Price limit slider (ZAR).
  - Quick filters (Sale, New, In-Stock, Wishlist).
  - Sort by Featured, Price, Rating, and Newest.
- **Product Details & Quick View Modal**:
  - Image gallery with thumbnail selection.
  - Size and variant selection (Apparel & Footwear).
  - Direct WhatsApp inquiry button with pre-filled product reference.
  - In-store showroom availability status.
  - Tabbed specifications: Description, Dimensions & Materials, Care Instructions, Delivery & Pick-up.
- **South African E-Commerce Ready**:
  - Slide-over Cart Drawer with free delivery threshold meter (Free shipping over R1,200).
  - Promo code discounts (`KOEKELOER10` for 10% off, `WINTER20` for 20% off).
  - 3-step checkout simulation with South African provinces and postal codes.
  - Delivery options: The Courier Guy tracked door-to-door, PostNet, and free in-store collection at Great White Junction Gansbaai.
  - Payment simulations: PayFast (Card), Ozow Instant EFT, SnapScan.
- **Store Showroom Locator**:
  - Detailed trading hours, Google Maps links, and WhatsApp quick chats for Koekeloer Geskenkwinkel (Shop 2, Great White Junction, Gansbaai).
- **Social Lookbook & Customer Testimonials**:
  - Direct links to Koekeloer Facebook page photos and community lookbook feed.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Confetti**: canvas-confetti

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment to GitHub & Vercel

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Koekeloer e-commerce platform"
   git branch -M main
   # Add your remote repository:
   # git remote add origin https://github.com/<your-user>/<repo-name>.git
   # git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com).
   - Import your GitHub repository.
   - Click **Deploy** (no custom environment variables required for preview demo).
