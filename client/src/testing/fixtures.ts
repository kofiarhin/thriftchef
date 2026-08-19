import type {
  CatalogueStatus,
  MealPlanResponse,
  ProductSearchResponse,
} from "../api/types";

export const CATALOGUE_STATUS: CatalogueStatus = {
  retailer: "aldi-uk",
  storeId: "belper-de56-1ar",
  availableProducts: 238,
  eligibleProducts: 164,
  lastCheckedAt: "2026-08-13T00:00:00.000Z",
  isStale: false,
  safetyBreakdown: { verified: 0, inferred: 164, incomplete: 55, ambiguous: 19 },
};

export const MEAL_PLAN: MealPlanResponse = {
  planId: "plan-1",
  generatedAt: "2026-08-13T09:00:00.000Z",
  currency: "GBP",
  budgetPence: 7000,
  estimatedTotalPence: 6420,
  budgetStatus: "within-budget",
  budgetUtilization: {
    targetPercent: 80,
    targetPence: 5600,
    actualPence: 6420,
    actualPercent: 92,
    withinPreferredRange: false,
  },
  mustHaveUsage: [],
  assumptions: ["Recipes are scaled for a household of 2."],
  warnings: [
    "Aldi does not publish allergen data, so allergens were inferred. Always check the label on the packaging.",
  ],
  days: Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    meals: [
      {
        mealType: "dinner" as const,
        recipeId: "dinner-1",
        title: "One-pan chicken with rice",
        servings: 2,
        estimatedCostPence: 420,
      },
    ],
  })),
  recipes: [
    {
      id: "dinner-1",
      title: "One-pan chicken with rice",
      mealType: "dinner",
      servings: 2,
      prepMinutes: 10,
      cookMinutes: 25,
      appliances: ["hob"],
      ingredients: [
        {
          productId: "prot1",
          name: "Chicken Breast Fillets",
          quantity: "40% of 650g",
          estimatedCostPence: 140,
          packages: 0.4,
          imageUrl: "https://cdn.aldi.test/prot1.jpg",
        },
        {
          productId: "stap1",
          name: "Basmati Rice",
          quantity: "20% of 1kg",
          estimatedCostPence: 29,
          packages: 0.2,
          imageUrl: "https://cdn.aldi.test/stap1.jpg",
        },
      ],
      steps: ["Brown the chicken.", "Add the rice and simmer."],
      pantryItems: ["salt", "cooking oil"],
      allergenWarnings: [],
      productIds: ["prot1", "stap1"],
    },
  ],
  shoppingList: [
    {
      category: "Fresh Food",
      items: [
        {
          productId: "prot1",
          name: "Chicken Breast Fillets",
          brand: "Ashfields",
          packageSize: "650g",
          quantity: 3,
          unitPricePence: 350,
          totalPricePence: 1050,
          productUrl: "https://www.aldi.co.uk/product/prot1",
          imageUrl: "https://cdn.aldi.test/prot1.jpg",
        },
      ],
    },
    {
      category: "Food Cupboard",
      items: [
        {
          productId: "stap1",
          name: "Basmati Rice",
          brand: null,
          packageSize: "1kg",
          quantity: 2,
          unitPricePence: 145,
          totalPricePence: 290,
          productUrl: "https://www.aldi.co.uk/product/stap1",
          imageUrl: "https://cdn.aldi.test/stap1.jpg",
        },
      ],
    },
  ],
  productCoverage: {
    productsConsidered: 164,
    productsUsed: 8,
    excludedForAllergies: 0,
    excludedForSafety: 74,
  },
};

export const PRODUCT_SEARCH_PAGE: ProductSearchResponse = {
  items: [
    {
      id: "p-chicken-breast",
      name: "Chicken Breast Fillets",
      category: "Fresh Food",
      pricePence: 389,
      packageSize: "650g",
      unitPrice: "£5.98 per kg",
      imageUrl: null,
      available: true,
    },
    {
      id: "p-basmati-rice",
      name: "Basmati Rice",
      category: "Food Cupboard",
      pricePence: 179,
      packageSize: "1kg",
      unitPrice: "£1.79 per kg",
      imageUrl: null,
      available: true,
    },
  ],
  page: 1,
  limit: 10,
  total: 2,
  totalPages: 1,
};

/** Enough products to reach and exceed the twelve-item must-have limit. */
export const LARGE_PRODUCT_SEARCH_PAGE: ProductSearchResponse = {
  items: Array.from({ length: 13 }, (_, index) => ({
    id: `bulk-${index}`,
    name: `Bulk Product ${index}`,
    category: "Food Cupboard",
    pricePence: 100 + index,
    packageSize: "500g",
    unitPrice: null,
    imageUrl: null,
    available: true,
  })),
  page: 1,
  limit: 20,
  total: 13,
  totalPages: 1,
};
