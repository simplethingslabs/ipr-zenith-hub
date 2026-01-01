import { z } from 'zod';

export const updateSettingsSchema = z.object({
  firmName: z.string().min(1).max(100).optional(),
  tagline: z.string().max(200).optional(),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.object({
    line: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
  }).optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal('')),
  }).optional(),
  heroImage: z.string().url().optional().or(z.literal('')),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
