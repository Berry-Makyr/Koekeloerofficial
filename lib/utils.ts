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

/** @deprecated Free shipping removed — courier always at client expense */
export const FREE_SHIPPING_THRESHOLD = Number.POSITIVE_INFINITY;
export const STANDARD_SHIPPING_FEE = 150;
export const EXPRESS_SHIPPING_FEE = 220;

export const COUPON_CODES: Record<string, { discountPercent: number; description: string }> = {};
