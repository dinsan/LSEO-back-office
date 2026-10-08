/** Typed application error. Services throw these; the route wrapper turns them into HTTP responses. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFound = (entity: string) =>
  new AppError(404, "NOT_FOUND", `${entity} not found`);
export const conflict = (message: string) => new AppError(409, "CONFLICT", message);
export const badRequest = (code: string, message: string) =>
  new AppError(400, code, message);
