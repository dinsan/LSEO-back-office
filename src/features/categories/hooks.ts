"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "./api";

export const categoryKeys = { all: ["categories"] as const };

export const useCategories = () =>
  useQuery({ queryKey: categoryKeys.all, queryFn: categoriesApi.list });

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoriesApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}
