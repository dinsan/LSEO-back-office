import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import type { Category, CategoryInput, CategoryUpdate } from "./schema";

export const categoryRepository = {
  async findAll(): Promise<Category[]> {
    return [...db.categories].sort((a, b) => a.name.localeCompare(b.name));
  },
  async findById(id: string) {
    return db.categories.find((c) => c.id === id) ?? null;
  },
  async findBySlug(slug: string) {
    return db.categories.find((c) => c.slug === slug) ?? null;
  },
  async create(input: CategoryInput & { slug: string }): Promise<Category> {
    const category: Category = { id: randomUUID(), createdAt: new Date().toISOString(), ...input };
    db.categories.push(category);
    return category;
  },
  async update(id: string, patch: CategoryUpdate & { slug?: string }) {
    const index = db.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    db.categories[index] = { ...db.categories[index], ...patch };
    return db.categories[index];
  },
  async delete(id: string) {
    const index = db.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;
    db.categories.splice(index, 1);
    return true;
  },
};
