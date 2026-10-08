import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { AppError, badRequest } from "./errors";

/** Success envelope: { data, meta? } */
export const ok = <T>(data: T, meta?: unknown) =>
  NextResponse.json(meta ? { data, meta } : { data });
export const created = <T>(data: T) => NextResponse.json({ data }, { status: 201 });
export const noContent = () => new NextResponse(null, { status: 204 });

/** Error envelope: { error: { code, message, details? } } */
export function errorResponse(err: unknown) {
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: err.flatten().fieldErrors,
        },
      },
      { status: 422 },
    );
  }
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: { code: err.code, message: err.message, details: err.details } },
      { status: err.status },
    );
  }
  console.error(err);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
    { status: 500 },
  );
}

/** Wraps a route handler so thrown errors become consistent JSON responses. */
export function withErrorHandling<C = unknown>(
  handler: (req: NextRequest, ctx: C) => Promise<Response>,
) {
  return async (req: NextRequest, ctx: C): Promise<Response> => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      return errorResponse(err);
    }
  };
}

export async function parseBody<S extends z.ZodTypeAny>(
  req: NextRequest,
  schema: S,
): Promise<z.output<S>> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw badRequest("INVALID_JSON", "Request body must be valid JSON");
  }
  return schema.parse(json);
}

export function parseQuery<S extends z.ZodTypeAny>(
  req: NextRequest,
  schema: S,
): z.output<S> {
  return schema.parse(Object.fromEntries(req.nextUrl.searchParams));
}
