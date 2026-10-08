import { noContent, ok, parseBody, withErrorHandling } from "@/lib/http";
import { productService } from "@/features/products/service";
import { productUpdateSchema } from "@/features/products/schema";

export const dynamic = "force-dynamic";
type Ctx = { params: { id: string } };

export const GET = withErrorHandling<Ctx>(async (_req, { params }) =>
  ok(await productService.get(params.id)),
);

export const PATCH = withErrorHandling<Ctx>(async (req, { params }) => {
  const patch = await parseBody(req, productUpdateSchema);
  return ok(await productService.update(params.id, patch));
});

export const DELETE = withErrorHandling<Ctx>(async (_req, { params }) => {
  await productService.remove(params.id);
  return noContent();
});
