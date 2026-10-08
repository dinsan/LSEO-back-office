import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  description: z.string().trim().max(300),
});
export const categoryUpdateSchema = categoryInputSchema.partial();

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;

export interface Category extends CategoryInput {
  id: string;
  slug: string;
  createdAt: string;
}
