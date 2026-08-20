import { QueryClient } from "@tanstack/react-query";

/**
 * One client for the whole app.
 *
 * Catalogue and retailer data changes on a crawl cadence, not per interaction,
 * so refetching on every window focus would spend a user's connection to
 * re-learn what it already knows. Generation and replacement are mutations and
 * are never cached.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        // A typed 4xx is the server telling us the request was wrong; retrying
        // it unchanged just asks the same question again.
        retry: (failureCount, error) => {
          const status = (error as { status?: number }).status;
          if (status !== undefined && status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
      },
    },
  });
}
