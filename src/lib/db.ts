import { randomUUID } from "crypto";
import type { Category } from "@/features/categories/schema";
import type { Product } from "@/features/products/schema";
import type { Campaign } from "@/features/campaigns/schema";

interface Database {
  categories: Category[];
  products: Product[];
  campaigns: Campaign[];
}

function seed(): Database {
  const now = new Date().toISOString();
  const cat = (name: string, description: string): Category => ({
    id: randomUUID(),
    name,
    description,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    createdAt: now,
  });
  const categories = [
    cat("Keyboards", "Mechanical and low-profile keyboards"),
    cat("Audio", "Headphones, DACs and speakers"),
    cat("Desk setup", "Stands, lamps and cable management"),
  ];
  const prod = (
    name: string,
    price: number,
    stock: number,
    categoryIndex: number,
    status: Product["status"] = "active",
  ): Product => ({
    id: randomUUID(),
    name,
    description: `${name} — seeded demo product.`,
    price,
    stock,
    categoryId: categories[categoryIndex].id,
    status,
    createdAt: now,
    updatedAt: now,
  });
  const products = [
    prod("Tactile 75 keyboard", 139, 42, 0),
    prod("Linear 65 keyboard", 119, 18, 0),
    prod("Open-back headphones", 249, 9, 1),
    prod("Desktop DAC", 179, 0, 1, "draft"),
    prod("Monitor light bar", 59, 120, 2),
    prod("Aluminium laptop stand", 45, 76, 2),
  ];
  return { categories, products, campaigns: [] };
}

/**
 * Module-level singletons are re-created on every hot reload in dev, so the store is
 * pinned to globalThis. To move to a real database, replace the repositories only —
 * services, routes and UI don't touch this file.
 */
const g = globalThis as unknown as { __commerceDb?: Database };
export const db: Database = (g.__commerceDb ??= seed());
