// Enums
export type PostCategory = 'Judgment' | 'Commentary';
export type PostStatus = 'draft' | 'published';
export type Audience = 'Individuals' | 'Businesses';
export type FeeType = 'fixed' | 'variable';

// Interfaces
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: PostCategory;
  tags: string[];
  status: PostStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeItem {
  id: string;
  name: string;
  audience: Audience;
  type: FeeType;
  priceMin: number;
  priceMax?: number;
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  firmName: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: {
    line: string;
    city: string;
    state: string;
    postalCode: string;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  heroImage?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
