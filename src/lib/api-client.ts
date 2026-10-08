export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ListResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export interface ItemResponse<T> {
  data: T;
}

/** Single place that talks to the API; throws ApiError with the server's message. */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const e = body?.error;
    throw new ApiError(res.status, e?.code ?? "UNKNOWN", e?.message ?? "Request failed", e?.details);
  }
  return body as T;
}
