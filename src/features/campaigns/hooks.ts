"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "./api";

export const campaignKeys = { all: ["campaigns"] as const };

export const useCampaigns = () => useQuery({ queryKey: campaignKeys.all, queryFn: campaignsApi.list });

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: campaignsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: campaignKeys.all }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: campaignsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: campaignKeys.all }),
  });
}
