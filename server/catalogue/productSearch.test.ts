import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createApp, type AppOverrides } from "../app";
import { ApiError } from "../http/errors";
import { startTestServer, testConfig } from "../testing/httpTestServer";
import { SEARCHABLE_CATALOGUE } from "../testing/catalogueFixtures";
import { parseProductSearchQuery } from "./productSearchController";
import {
  buildSearchFilter,
  searchProductsInMemory,
  type ProductSearchParams,
  type ProductSearchResponse,
} from "./productSearchService";

function params(overrides: Partial<ProductSearchParams> = {}): ProductSearchParams {
  return {
    storeId: "belper-de56-1ar",
    search: "",
    category: null,
    page: 1,
    limit: 20,
    ...overrides,
  };
}

const WITH_CATALOGUE: AppOverrides = {
  searchProducts: async (searchParams) =>
    searchProductsInMemory(SEARCHABLE_CATALOGUE, searchParams),
};

async function withServer(
  run: (get: (query: string) => Promise<Response>) => Promise<void>,
  overrides: AppOverrides = WITH_CATALOGUE,
): Promise<void> {
  const server = await startTestServer(createApp(testConfig(), overrides));

  try {
    await run((query) => server.fetch(`/api/products${query}`));
  } finally {
    await server.close();
  }
}

describe("parseProductSearchQuery", () => {
  it("defaults to the first page of twenty", () => {
    const parsed = parseProductSearchQuery({}, "belper-de56-1ar");

    assert.equal(parsed.page, 1);
    assert.equal(parsed.limit, 20);
    assert.equal(parsed.search, "");
    assert.equal(parsed.category, null);
  });

  it("trims and collapses the search term", () => {
    const parsed = parseProductSearchQuery(
      { search: "  chicken   breast " },
      "belper-de56-1ar",
    );

    assert.equal(parsed.search, "chicken breast");
  });

  it("rejects a limit above the documented maximum", () => {
    assert.throws(
      () => parseProductSearchQuery({ limit: "51" }, "belper-de56-1ar"),
      (error: unknown) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.status, 400);
        return true;
      },
    );
  });

  it("rejects pagination that is not a whole number", () => {
    for (const query of [{ page: "0" }, { page: "1.5" }, { page: "abc" }, { limit: "0" }]) {
      assert.throws(() => parseProductSearchQuery(query, "belper-de56-1ar"), ApiError);
    }
  });

  it("rejects a repeated parameter rather than guessing which one was meant", () => {
    assert.throws(
      () => parseProductSearchQuery({ search: ["a", "b"] }, "belper-de56-1ar"),
      ApiError,
    );
  });
});

describe("buildSearchFilter", () => {
  it("always scopes the query to one store's available products", () => {
    const filter = buildSearchFilter(params());

    assert.equal(filter.retailer, "aldi-uk");
    assert.equal(filter.storeId, "belper-de56-1ar");
    assert.equal(filter.available, true);
  });

  it("requires every search word rather than any of them", () => {
    const filter = buildSearchFilter(params({ search: "chicken breast" }));

    assert.equal(filter.$and?.length, 2);
  });

  it("escapes regex punctuation in the search term", () => {
    const filter = buildSearchFilter(params({ search: "a.*b" }));
    const clause = filter.$and?.[0] as { $or: Array<{ name?: RegExp }> };

    assert.equal(clause.$or[0].name?.source, "a\\.\\*b");
  });
});

describe("searchProductsInMemory", () => {
  it("orders results by name then id, so pages never overlap", () => {
    const first = searchProductsInMemory(SEARCHABLE_CATALOGUE, params({ limit: 3 }));
    const second = searchProductsInMemory(
      SEARCHABLE_CATALOGUE,
      params({ limit: 3, page: 2 }),
    );

    const names = [...first.items, ...second.items].map((item) => item.name);
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
    assert.equal(new Set(names).size, names.length);
  });
});

describe("GET /api/products", () => {
  it("returns a paginated browse for an empty search term", async () => {
    await withServer(async (get) => {
      const response = await get("");
      const body = (await response.json()) as ProductSearchResponse;

      assert.equal(response.status, 200);
      assert.equal(body.page, 1);
      assert.equal(body.limit, 20);
      assert.equal(body.total, SEARCHABLE_CATALOGUE.length);
      assert.equal(body.totalPages, Math.ceil(SEARCHABLE_CATALOGUE.length / 20));
      assert.ok(body.items.length <= 20);
    });
  });

  it("filters by search term", async () => {
    await withServer(async (get) => {
      const body = (await (await get("?search=chicken")).json()) as ProductSearchResponse;

      assert.ok(body.total > 0);
      for (const item of body.items) {
        assert.match(item.name, /chicken/i);
      }
    });
  });

  it("filters by category", async () => {
    await withServer(async (get) => {
      const body = (await (
        await get("?category=Bakery")
      ).json()) as ProductSearchResponse;

      assert.ok(body.total > 0);
      for (const item of body.items) {
        assert.equal(item.category, "Bakery");
      }
    });
  });

  it("pages through the catalogue without repeating or losing a product", async () => {
    await withServer(async (get) => {
      const first = (await (await get("?limit=5&page=1")).json()) as ProductSearchResponse;
      const second = (await (await get("?limit=5&page=2")).json()) as ProductSearchResponse;

      assert.equal(first.items.length, 5);
      assert.equal(first.total, second.total);
      assert.equal(
        new Set([...first.items, ...second.items].map((item) => item.id)).size,
        first.items.length + second.items.length,
      );
    });
  });

  it("returns the same page for the same query", async () => {
    await withServer(async (get) => {
      const first = await (await get("?search=b&limit=4")).json();
      const second = await (await get("?search=b&limit=4")).json();

      assert.deepEqual(first, second);
    });
  });

  it("rejects invalid pagination with a field-free bad request", async () => {
    await withServer(async (get) => {
      for (const query of ["?page=0", "?limit=51", "?limit=abc", "?page=-2"]) {
        const response = await get(query);

        assert.equal(response.status, 400, `${query} was accepted`);
        const body = (await response.json()) as { error: { code: string } };
        assert.equal(body.error.code, "INVALID_REQUEST");
      }
    });
  });

  it("returns an empty page rather than an error past the last result", async () => {
    await withServer(async (get) => {
      const body = (await (
        await get("?search=chicken&page=50")
      ).json()) as ProductSearchResponse;

      assert.deepEqual(body.items, []);
      assert.ok(body.total > 0);
    });
  });

  it("exposes only the fields the picker needs", async () => {
    await withServer(async (get) => {
      const body = (await (await get("?limit=1")).json()) as ProductSearchResponse;

      assert.deepEqual(Object.keys(body.items[0]).sort(), [
        "available",
        "category",
        "id",
        "imageUrl",
        "name",
        "packageSize",
        "pricePence",
        "unitPrice",
      ]);
    });
  });
});
