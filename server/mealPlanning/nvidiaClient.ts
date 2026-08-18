import type { NvidiaConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { buildAiContext } from "./contextBuilder";
import { PlanRejectedError } from "./mealPlanValidator";
import { buildPrompt } from "./promptBuilder";
import type {
  GenerationTiming,
  PlanGenerator,
  PlanGeneratorInput,
} from "./mealPlanTypes";

export interface NvidiaClientOptions {
  config: NvidiaConfig;
  maxContextProducts: number;
  /** Injected in tests; defaults to the platform fetch. */
  fetchImpl?: typeof fetch;
}

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: unknown } }>;
}

/**
 * Models often wrap JSON in prose or a markdown fence despite instructions to
 * the contrary. Recovering the object is repair, not trust: the result still
 * goes through the full validator.
 */
export function extractJsonObject(content: string): unknown {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = (fenced ?? content).trim();

  try {
    return JSON.parse(candidate);
  } catch {
    // Fall through to a brace-balanced scan.
  }

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new PlanRejectedError(
      "INVALID_JSON",
      "The AI response did not contain valid JSON.",
    );
  }

  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    throw new PlanRejectedError(
      "INVALID_JSON",
      "The AI response did not contain valid JSON.",
    );
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

const TIMEOUT_MESSAGE =
  "The meal plan service did not respond in time. Try again in a moment.";

/**
 * Calls the NVIDIA chat-completions API and returns the raw plan candidate.
 *
 * The API key is read from config and never logged, echoed, or included in an
 * error. Transient network and 5xx failures are retried up to `maxRetries`.
 *
 * A timeout is deliberately *not* retried: `timeoutMs` is the promise made to
 * the caller about how long they may wait, and retrying an abort would silently
 * turn one such wait into several. It surfaces as a 504 instead, and the user
 * decides whether to spend another wait on it.
 */
export function createNvidiaGenerator(options: NvidiaClientOptions): PlanGenerator {
  const { config, maxContextProducts } = options;
  const doFetch = options.fetchImpl ?? fetch;

  return async (input: PlanGeneratorInput): Promise<unknown> => {
    const contextStarted = Date.now();
    const context = buildAiContext(input.products, input.request, {
      maxProducts: maxContextProducts,
    });
    const prompt = buildPrompt(input.request, context, {
      retry: input.retry,
      replacement: input.replacement,
    });
    const contextMs = Date.now() - contextStarted;

    const report = (
      attempt: number,
      upstreamMs: number,
      parseMs: number,
      outcome: GenerationTiming["outcome"],
    ): void => {
      input.onTiming?.({ attempt, contextMs, upstreamMs, parseMs, outcome });
    };

    /**
     * Never outlive the request's shared deadline. Without this, a repair
     * attempt would start a fresh full-length timeout of its own.
     */
    const attemptTimeout = (): number =>
      input.deadlineAt === undefined
        ? config.timeoutMs
        : Math.min(config.timeoutMs, input.deadlineAt - Date.now());

    for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
      const remaining = attemptTimeout();
      if (remaining <= 0) {
        report(attempt + 1, 0, 0, "timeout");
        throw ApiError.gatewayTimeout(TIMEOUT_MESSAGE);
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), remaining);
      const upstreamStarted = Date.now();

      try {
        const response = await doFetch(config.apiUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: "system", content: prompt.system },
              { role: "user", content: prompt.user },
            ],
            temperature: 0,
            max_tokens: 4096,
            response_format: { type: "json_object" },
          }),
          signal: controller.signal,
        });

        const upstreamMs = Date.now() - upstreamStarted;

        if (!response.ok) {
          if (isRetryableStatus(response.status) && attempt < config.maxRetries) {
            report(attempt + 1, upstreamMs, 0, "upstream-error");
            continue;
          }

          report(attempt + 1, upstreamMs, 0, "upstream-error");

          // The upstream body may quote the request, so only the status is
          // surfaced and nothing from the response is passed on.
          throw new ApiError(
            502,
            "AI_INVALID_RESPONSE",
            `The meal plan service rejected the request (upstream status ${response.status}).`,
          );
        }

        const payload = (await response.json()) as ChatCompletionResponse;
        const content = payload.choices?.[0]?.message?.content;

        if (typeof content !== "string" || content.trim().length === 0) {
          report(attempt + 1, upstreamMs, 0, "invalid-json");
          throw new PlanRejectedError(
            "INVALID_JSON",
            "The AI response contained no message content.",
          );
        }

        const parseStarted = Date.now();
        try {
          const parsed = extractJsonObject(content);
          report(attempt + 1, upstreamMs, Date.now() - parseStarted, "ok");
          return parsed;
        } catch (error) {
          report(attempt + 1, upstreamMs, Date.now() - parseStarted, "invalid-json");
          throw error;
        }
      } catch (error) {
        if (error instanceof ApiError) throw error;

        // A timeout ends the call outright — see the note on this function.
        if (controller.signal.aborted) {
          report(attempt + 1, Date.now() - upstreamStarted, 0, "timeout");
          throw ApiError.gatewayTimeout(TIMEOUT_MESSAGE);
        }

        if (attempt < config.maxRetries) {
          report(attempt + 1, Date.now() - upstreamStarted, 0, "upstream-error");
          continue;
        }

        report(attempt + 1, Date.now() - upstreamStarted, 0, "upstream-error");
        throw new ApiError(
          502,
          "AI_INVALID_RESPONSE",
          "The meal plan service could not be reached.",
        );
      } finally {
        clearTimeout(timer);
      }
    }

    // Unreachable: every loop exit above either returns or throws.
    throw new ApiError(
      502,
      "AI_INVALID_RESPONSE",
      "The meal plan service could not be reached.",
    );
  };
}
