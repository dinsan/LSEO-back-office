import { created, ok, parseBody, parseQuery, withErrorHandling } from "@/lib/http";
import { productService } from "@/features/products/service";
import { productInputSchema, productQuerySchema } from "@/features/products/schema";

export const dynamic = "force-dynamic";

export const GET = withErrorHandling(async (req) => {
  const { items, meta } = await productService.list(parseQuery(req, productQuerySchema));
  return ok(items, meta);
});

export const POST = withErrorHandling(async (req) => {
  const input = await parseBody(req, productInputSchema);
  return created(await productService.create(input));
});
