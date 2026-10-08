import { noContent, ok, parseBody, withErrorHandling } from "@/lib/http";
import { categoryService } from "@/features/categories/service";
import { categoryUpdateSchema } from "@/features/categories/schema";

export const dynamic = "force-dynamic";
type Ctx = { params: { id: string } };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) =>
  ok(await categoryService.get(params.id)),
);

export const PATCH = withErrorHandling<Ctx>(async (req, { params }) => {
  const patch = await parseBody(req, categoryUpdateSchema);
  return ok(await categoryService.update(params.id, patch));
});

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  await categoryService.remove(params.id);
  return noContent();
});
