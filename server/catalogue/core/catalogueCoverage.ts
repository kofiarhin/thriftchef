/**
 * Tracks listing-page coverage for one crawl.
 *
 * A category is complete only when every listing request it disclosed has
 * completed successfully. This is intentionally independent of product count:
 * one failed pagination page may hide dozens of products while looking like
 * only one failed request.
 */
export class CatalogueCoverageTracker {
  private readonly expected = new Map<string, Set<string>>();
  private readonly completed = new Map<string, Set<string>>();

  expect(categoryKey: string, requestKey: string): void {
    const requests = this.expected.get(categoryKey) ?? new Set<string>();
    requests.add(requestKey);
    this.expected.set(categoryKey, requests);
  }

  complete(categoryKey: string, requestKey: string): void {
    // A completion that was never expected cannot make coverage look better.
    if (!this.expected.get(categoryKey)?.has(requestKey)) return;

    const requests = this.completed.get(categoryKey) ?? new Set<string>();
    requests.add(requestKey);
    this.completed.set(categoryKey, requests);
  }

  completedCategoryCount(): number {
    let count = 0;

    for (const [categoryKey, expected] of this.expected) {
      const completed = this.completed.get(categoryKey);
      if (
        expected.size > 0 &&
        completed &&
        [...expected].every((requestKey) => completed.has(requestKey))
      ) {
        count += 1;
      }
    }

    return count;
  }
}
