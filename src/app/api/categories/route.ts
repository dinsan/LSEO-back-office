import { created, ok, parseBody, withErrorHandling } from "@/lib/http";
import { categoryService } from "@/features/categories/service";
import { categoryInputSchema } from "@/features/categories/schema";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async () => ok(await categoryService.list()));

export const POST = withErrorHandling(async (req) => {
  const input = await parseBody(req, categoryInputSchema);
  return created(await categoryService.create(input));
});
