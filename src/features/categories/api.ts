import { apiFetch, type ItemResponse } from "@/lib/api-client";
import type { Category, CategoryInput } from "./schema";

export const categoriesApi = {
  list: () => apiFetch<ItemResponse<Category[]>>("/api/categories").then((r) => r.data),
  create: (input: CategoryInput) =>
    apiFetch<ItemResponse<Category>>("/api/categories", { method: "POST", body: JSON.stringify(input) }).then((r) => r.data),
  remove: (id: string) => apiFetch<void>(`/api/categories/${id}`, { method: "DELETE" }),
};
