import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import type { Campaign, CampaignInput } from "./schema";

export const campaignRepository = {
  async findAll(): Promise<Campaign[]> {
    return [...db.campaigns].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  async findById(id: string) {
    return db.campaigns.find((c) => c.id === id) ?? null;
  },
  async create(input: CampaignInput): Promise<Campaign> {
    const campaign: Campaign = { id: randomUUID(), createdAt: new Date().toISOString(), ...input };
    db.campaigns.push(campaign);
    return campaign;
  },
  async delete(id: string) {
    const index = db.campaigns.findIndex((c) => c.id === id);
    if (index === -1) return false;
    db.campaigns.splice(index, 1);
    return true;
  },
};
