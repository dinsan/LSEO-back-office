import { conflict, notFound } from "@/lib/errors";
import { productRepository } from "@/features/products/repository";
import { categoryRepository } from "./repository";
import type { CategoryInput, CategoryUpdate } from "./schema";

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const categoryService = {
  list: () => categoryRepository.findAll(),

  async get(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw notFound("Category");
    return category;
  },

  async create(input: CategoryInput) {
    const slug = slugify(input.name);
    if (await categoryRepository.findBySlug(slug)) {
      throw conflict(`A category named "${input.name}" already exists`);
    }
    return categoryRepository.create({ ...input, slug });
  },

  async update(id: string, patch: CategoryUpdate) {
    const current = await this.get(id);
    let slug: string | undefined;
    if (patch.name) {
      slug = slugify(patch.name);
      const clash = await categoryRepository.findBySlug(slug);
      if (clash && clash.id !== current.id) {
        throw conflict(`A category named "${patch.name}" already exists`);
      }
    }
    return (await categoryRepository.update(id, { ...patch, slug }))!;
  },

  async remove(id: string) {
    await this.get(id);
    const inUse = await productRepository.countByCategory(id);
    if (inUse > 0) {
      throw conflict(`Can't delete: ${inUse} product${inUse === 1 ? "" : "s"} still use this category`);
    }
    await categoryRepository.delete(id);
  },
};
