import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  description: z.string().trim().max(1000),
  price: z.number({ invalid_type_error: "Enter a price" }).positive("Price must be above 0").max(1_000_000),
  stock: z.number({ invalid_type_error: "Enter a stock count" }).int("Stock must be a whole number").min(0),
  categoryId: z.string().min(1, "Choose a category"),
  status: z.enum(["draft", "active"]),
});
export const productUpdateSchema = productInputSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  categoryId: z.string().optional(),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type ProductQuery = z.output<typeof productQuerySchema>;

export interface Product extends ProductInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}
