import { created, ok, parseBody, withErrorHandling } from "@/lib/http";
import { campaignService } from "@/features/campaigns/service";
import { campaignInputSchema } from "@/features/campaigns/schema";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async () => ok(await campaignService.list()));

export const POST = withErrorHandling(async (req) => {
  const input = await parseBody(req, campaignInputSchema);
  return created(await campaignService.create(input));
});
