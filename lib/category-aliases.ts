/** Legacy shop URLs → current category slugs */
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  lighting: 'lamps',
  'mirrors-art': 'mirrors',
  'shoes-leather': 'boutique-apparel',
  'gifts-nautical': 'nauticals',
  kitchenware: 'kitchenware-dining',
};

export function resolveCategorySlug(slug: string): string {
  return CATEGORY_SLUG_ALIASES[slug] || slug;
}
