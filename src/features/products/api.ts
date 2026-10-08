import { apiFetch, type ItemResponse, type ListResponse } from "@/lib/api-client";
import type { Product, ProductInput, ProductQuery, ProductUpdate } from "./schema";

type ListParams = Partial<Pick<ProductQuery, "page" | "limit" | "search" | "categoryId">>;

export const productsApi = {
  list: (params: ListParams = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && v !== "" && qs.set(k, String(v)));
    return apiFetch<ListResponse<Product>>(`/api/products?${qs}`);
  },
  create: (input: ProductInput) =>
    apiFetch<ItemResponse<Product>>("/api/products", { method: "POST", body: JSON.stringify(input) }).then((r) => r.data),
  update: ({ id, ...patch }: ProductUpdate & { id: string }) =>
    apiFetch<ItemResponse<Product>>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(patch) }).then((r) => r.data),
  remove: (id: string) => apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }),
};
