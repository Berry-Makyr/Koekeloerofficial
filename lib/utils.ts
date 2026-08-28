import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('ZAR', 'R');
}

export const FREE_SHIPPING_THRESHOLD = 1200;
export const STANDARD_SHIPPING_FEE = 150;
export const EXPRESS_SHIPPING_FEE = 220;

export const COUPON_CODES: Record<string, { discountPercent: number; description: string }> = {
  KOEKELOER10: { discountPercent: 10, description: '10% Welcome Discount' },
  WINTER20: { discountPercent: 20, description: '20% Seasonal Sale' },
  BEACHSAND: { discountPercent: 15, description: '15% Coastal Living Special' },
};
