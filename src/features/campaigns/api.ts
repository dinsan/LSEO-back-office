import { apiFetch, type ItemResponse } from "@/lib/api-client";
import type { CampaignInput, CampaignWithStatus } from "./schema";

export const campaignsApi = {
  list: () => apiFetch<ItemResponse<CampaignWithStatus[]>>("/api/campaigns").then((r) => r.data),
  create: (input: CampaignInput) =>
    apiFetch<ItemResponse<CampaignWithStatus>>("/api/campaigns", { method: "POST", body: JSON.stringify(input) }).then((r) => r.data),
  remove: (id: string) => apiFetch<void>(`/api/campaigns/${id}`, { method: "DELETE" }),
};
