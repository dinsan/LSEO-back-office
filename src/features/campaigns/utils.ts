import type { CampaignStatus } from "./schema";

/** Pure function so it is trivial to unit test. Dates are YYYY-MM-DD strings. */
export function getCampaignStatus(
  startDate: string,
  endDate: string,
  today: string = new Date().toISOString().slice(0, 10),
): CampaignStatus {
  if (today < startDate) return "scheduled";
  if (today > endDate) return "ended";
  return "active";
}
