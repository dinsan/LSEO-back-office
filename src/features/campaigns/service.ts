import { badRequest, notFound } from "@/lib/errors";
import { productRepository } from "@/features/products/repository";
import { campaignRepository } from "./repository";
import type { Campaign, CampaignInput, CampaignWithStatus } from "./schema";
import { getCampaignStatus } from "./utils";

const withStatus = (c: Campaign): CampaignWithStatus => ({
  ...c,
  status: getCampaignStatus(c.startDate, c.endDate),
});

export const campaignService = {
  async list() {
    return (await campaignRepository.findAll()).map(withStatus);
  },

  async get(id: string) {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) throw notFound("Campaign");
    return withStatus(campaign);
  },

  async create(input: CampaignInput) {
    const found = await productRepository.findByIds(input.productIds);
    if (found.length !== new Set(input.productIds).size) {
      throw badRequest("INVALID_PRODUCTS", "One or more selected products do not exist");
    }
    if (input.discountType === "fixed") {
      const cheapest = Math.min(...found.map((p) => p.price));
      if (input.discountValue >= cheapest) {
        throw badRequest(
          "DISCOUNT_TOO_HIGH",
          `A fixed discount must be lower than the cheapest selected product ($${cheapest})`,
        );
      }
    }
    return withStatus(await campaignRepository.create(input));
  },

  async remove(id: string) {
    await this.get(id);
    await campaignRepository.delete(id);
  },
};
