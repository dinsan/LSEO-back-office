import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import type { Product, ProductInput, ProductQuery, ProductUpdate } from "./schema";

export const productRepository = {
  async findMany({ page, limit, search, categoryId }: ProductQuery) {
    const term = search?.toLowerCase();
    const filtered = db.products
      .filter((p) => !categoryId || p.categoryId === categoryId)
      .filter((p) => !term || p.name.toLowerCase().includes(term))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const start = (page - 1) * limit;
    return { items: filtered.slice(start, start + limit), total: filtered.length };
  },
  async findById(id: string) {
    return db.products.find((p) => p.id === id) ?? null;
  },
  async findByIds(ids: string[]) {
    return db.products.filter((p) => ids.includes(p.id));
  },
  async countByCategory(categoryId: string) {
    return db.products.filter((p) => p.categoryId === categoryId).length;
  },
  async count() {
    return db.products.length;
  },
  async create(input: ProductInput): Promise<Product> {
    const now = new Date().toISOString();
    const product: Product = { id: randomUUID(), createdAt: now, updatedAt: now, ...input };
    db.products.unshift(product);
    return product;
  },
  async update(id: string, patch: ProductUpdate) {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    db.products[index] = { ...db.products[index], ...patch, updatedAt: new Date().toISOString() };
    return db.products[index];
  },
  async delete(id: string) {
    const index = db.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    db.products.splice(index, 1);
    return true;
  },
};
