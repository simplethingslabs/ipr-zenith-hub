import { z } from 'zod';

export const createFeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  audience: z.enum(['Individuals', 'Businesses']),
  type: z.enum(['fixed', 'variable']),
  priceMin: z.number().int().min(0),
  priceMax: z.number().int().min(0).optional(),
  category: z.string().min(1, 'Category is required'),
  notes: z.string().optional(),
});

export const updateFeeSchema = createFeeSchema.partial();

export type CreateFeeInput = z.infer<typeof createFeeSchema>;
export type UpdateFeeInput = z.infer<typeof updateFeeSchema>;
