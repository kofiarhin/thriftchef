import type { NvidiaConfig } from "../config/env";
import { ApiError } from "../http/errors";
import { buildAiContext } from "./contextBuilder";
import { PlanRejectedError } from "./mealPlanValidator";
import { buildPrompt } from "./promptBuilder";
import type { PlanGenerator, PlanGeneratorInput } from "./mealPlanTypes";

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

/**
 * Calls the NVIDIA chat-completions API and returns the raw plan candidate.
 *
 * The API key is read from config and never logged, echoed, or included in an
 * error. Network and 5xx failures are retried up to `maxRetries`; a timeout
 * surfaces as a 504 so the client can offer a retry.
 */
export function createNvidiaGenerator(options: NvidiaClientOptions): PlanGenerator {
  const { config, maxContextProducts } = options;
  const doFetch = options.fetchImpl ?? fetch;

  return async (input: PlanGeneratorInput): Promise<unknown> => {
    const context = buildAiContext(input.products, input.request, {
      maxProducts: maxContextProducts,
    });
    const prompt = buildPrompt(input.request, context, { retry: input.retry });

    for (let attempt = 0; attempt <= config.maxRetries; attempt += 1) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs);

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
            temperature: 0.2,
            max_tokens: 4096,
            response_format: { type: "json_object" },
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          if (isRetryableStatus(response.status) && attempt < config.maxRetries) {
            continue;
          }

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
          throw new PlanRejectedError(
            "INVALID_JSON",
            "The AI response contained no message content.",
          );
        }

        return extractJsonObject(content);
      } catch (error) {
        if (error instanceof ApiError) throw error;

        if (controller.signal.aborted) {
          if (attempt < config.maxRetries) continue;

          throw ApiError.gatewayTimeout(
            "The meal plan service did not respond in time. Try again in a moment.",
          );
        }

        if (attempt < config.maxRetries) continue;

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
