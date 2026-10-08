import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date");

export const campaignInputSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters").max(80),
    description: z.string().trim().max(300),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number({ invalid_type_error: "Enter a discount" }).positive("Discount must be above 0"),
    startDate: isoDate,
    endDate: isoDate,
    productIds: z.array(z.string()).min(1, "Pick at least one product"),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date can't be before the start date",
    path: ["endDate"],
  })
  .refine((d) => d.discountType !== "percentage" || d.discountValue <= 100, {
    message: "A percentage discount can't exceed 100",
    path: ["discountValue"],
  });

export type CampaignInput = z.infer<typeof campaignInputSchema>;
export type CampaignStatus = "scheduled" | "active" | "ended";

export interface Campaign extends CampaignInput {
  id: string;
  createdAt: string;
}
export interface CampaignWithStatus extends Campaign {
  status: CampaignStatus;
}
