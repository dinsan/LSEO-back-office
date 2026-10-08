import { describe, expect, it } from "vitest";
import { getCampaignStatus } from "./utils";
import { campaignInputSchema } from "./schema";

describe("getCampaignStatus", () => {
  it("is scheduled before the start date", () => {
    expect(getCampaignStatus("2026-12-01", "2026-12-31", "2026-11-30")).toBe("scheduled");
  });
  it("is active between start and end, inclusive", () => {
    expect(getCampaignStatus("2026-12-01", "2026-12-31", "2026-12-01")).toBe("active");
    expect(getCampaignStatus("2026-12-01", "2026-12-31", "2026-12-31")).toBe("active");
  });
  it("is ended after the end date", () => {
    expect(getCampaignStatus("2026-12-01", "2026-12-31", "2027-01-01")).toBe("ended");
  });
});

describe("campaignInputSchema", () => {
  const valid = {
    name: "Black Friday",
    description: "",
    discountType: "percentage" as const,
    discountValue: 20,
    startDate: "2026-11-27",
    endDate: "2026-11-30",
    productIds: ["p1"],
  };
  it("accepts a valid campaign", () => {
    expect(campaignInputSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects an end date before the start date", () => {
    expect(campaignInputSchema.safeParse({ ...valid, endDate: "2026-11-01" }).success).toBe(false);
  });
  it("rejects a percentage discount above 100", () => {
    expect(campaignInputSchema.safeParse({ ...valid, discountValue: 150 }).success).toBe(false);
  });
  it("requires at least one product", () => {
    expect(campaignInputSchema.safeParse({ ...valid, productIds: [] }).success).toBe(false);
  });
});
