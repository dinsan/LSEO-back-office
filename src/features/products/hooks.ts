"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "./api";

export const productKeys = {
  all: ["products"] as const,
  list: (params: object) => ["products", "list", params] as const,
};

export const useProducts = (params: Parameters<typeof productsApi.list>[0] = {}) =>
  useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.list(params),
    placeholderData: keepPreviousData,
  });

function useInvalidatingMutation<TVars, TData>(fn: (v: TVars) => Promise<TData>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export const useCreateProduct = () => useInvalidatingMutation(productsApi.create);
export const useUpdateProduct = () => useInvalidatingMutation(productsApi.update);
export const useDeleteProduct = () => useInvalidatingMutation(productsApi.remove);
