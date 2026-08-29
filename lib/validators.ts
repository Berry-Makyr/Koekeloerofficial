import { z } from 'zod';
import { UserRole, DeliveryMethod, DiscountType } from '@prisma/client';

export const RegisterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const AddressSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name is required'),
  phone: z.string().min(7, 'Contact telephone is required'),
  addressLine1: z.string().min(3, 'Street address is required'),
  addressLine2: z.string().optional(),
  suburb: z.string().optional(),
  city: z.string().min(2, 'City/Town is required'),
  province: z.string().min(2, 'Province is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().default('South Africa'),
  isDefault: z.boolean().default(false),
});

export const ProductCreateSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Valid URL slug is required'),
  sku: z.string().optional(),
  description: z.string().min(10, 'Detailed description is required'),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be greater than 0'),
  originalPrice: z.number().positive().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image URL is required'),
  badges: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  dimensions: z.string().optional(),
  materials: z.string().optional(),
  careInstructions: z.string().optional(),
  origin: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isSale: z.boolean().default(false),
  trackInventory: z.boolean().default(true),
  totalStock: z.number().int().nonnegative().default(0),
});

export const ProductVariantCreateSchema = z.object({
  productId: z.string(),
  sku: z.string().min(2, 'Unique SKU is required'),
  title: z.string().min(1, 'Variant title is required (e.g., Size 6 / Sage)'),
  priceAdjustment: z.number().default(0),
  stockQuantity: z.number().int().nonnegative().default(0),
  attributes: z.record(z.string(), z.string()).default({}),
  isActive: z.boolean().default(true),
});

export const InventoryAdjustmentSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  newQuantity: z.number().int().nonnegative(),
  reason: z.string().min(3, 'Reason for adjustment is required'),
});

export const CheckoutCartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const CheckoutOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer full name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(7, 'Contact phone is required'),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema.optional(),
  items: z.array(CheckoutCartItemSchema).min(1, 'Cart cannot be empty'),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
});

export const PromoCodeSchema = z.object({
  code: z.string().min(3, 'Promo code must be at least 3 characters').toUpperCase(),
  type: z.nativeEnum(DiscountType),
  value: z.number().positive('Discount value must be positive'),
  minOrderAmount: z.number().nonnegative().default(0),
  maxUses: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().default(1),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});
