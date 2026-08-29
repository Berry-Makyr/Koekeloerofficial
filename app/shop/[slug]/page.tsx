import { products } from '@/data/products';
import ProductDetailView from '@/components/product/ProductDetailView';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return {
      title: 'Product Details | Koekeloer Gansbaai',
      description: 'Explore custom artisan coastal decor, Bali teak furniture, and boutique fashion at Koekeloer Gansbaai.',
    };
  }

  return {
    title: `${product.name} | Koekeloer Gansbaai`,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  return <ProductDetailView slug={slug} initialProduct={product} />;
}
