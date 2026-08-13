import type { FieldIssue } from "./types";

/**
 * Requests go to a relative /api path: the Vite dev server proxies it locally,
 * and in production the API is served from the same origin or fronted by a
 * rewrite. Nothing about the backend location is compiled into the bundle.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * A failed request the UI can act on. `code` drives which recovery the user is
 * offered, so failures must never collapse into a generic message.
 */
export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }

  /** Per-field problems, when the server rejected the form's contents. */
  get fieldIssues(): FieldIssue[] {
    return Array.isArray(this.details) ? (this.details as FieldIssue[]) : [];
  }

  get suggestions(): string[] {
    const details = this.details as { suggestions?: unknown } | undefined;
    return Array.isArray(details?.suggestions)
      ? (details.suggestions as string[])
      : [];
  }

  get isRetryable(): boolean {
    return this.status >= 500 || this.status === 429 || this.status === 422;
  }
}

interface ErrorBody {
  error?: { code?: string; message?: string; details?: unknown };
}

async function toError(response: Response): Promise<ApiRequestError> {
  let body: ErrorBody = {};

  try {
    body = (await response.json()) as ErrorBody;
  } catch {
    // A non-JSON failure (a proxy error page, say) still needs a usable message.
  }

  return new ApiRequestError(
    response.status,
    body.error?.code ?? "UNKNOWN_ERROR",
    body.error?.message ?? "The request could not be completed.",
    body.error?.details,
  );
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "content-type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiRequestError(
      0,
      "NETWORK_ERROR",
      "Could not reach the ThriftChef API. Check that the server is running.",
    );
  }

  if (!response.ok) throw await toError(response);

  return (await response.json()) as T;
}
