import { noContent, ok, withErrorHandling } from "@/lib/http";
import { campaignService } from "@/features/campaigns/service";

export const dynamic = "force-dynamic";
type Ctx = { params: { id: string } };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) =>
  ok(await campaignService.get(params.id)),
);

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  await campaignService.remove(params.id);
  return noContent();
});
