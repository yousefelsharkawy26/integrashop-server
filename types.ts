/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  stock: number;
  category: string;
  brand: string;
  image: string;
  featured: boolean;
  specifications: Record<string, string>;
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  image: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Address {
  id: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  addresses: Address[];
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minSpend?: number;
  expiryDate: string;
  description: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  shippingMethod: string;
  couponCode?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export interface CheckoutDetails {
  shippingAddressId?: string;
  shippingMethod: string;
  couponCode?: string;
}
