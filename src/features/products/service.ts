import { badRequest, notFound } from "@/lib/errors";
import { categoryRepository } from "@/features/categories/repository";
import { productRepository } from "./repository";
import type { ProductInput, ProductQuery, ProductUpdate } from "./schema";

async function assertCategoryExists(categoryId: string) {
  if (!(await categoryRepository.findById(categoryId))) {
    throw badRequest("INVALID_CATEGORY", "The selected category does not exist");
  }
}

export const productService = {
  async list(query: ProductQuery) {
    const { items, total } = await productRepository.findMany(query);
    return {
      items,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  },

  async get(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw notFound("Product");
    return product;
  },

  async create(input: ProductInput) {
    await assertCategoryExists(input.categoryId);
    return productRepository.create(input);
  },

  async update(id: string, patch: ProductUpdate) {
    await this.get(id);
    if (patch.categoryId) await assertCategoryExists(patch.categoryId);
    return (await productRepository.update(id, patch))!;
  },

  async remove(id: string) {
    await this.get(id);
    await productRepository.delete(id);
  },
};
