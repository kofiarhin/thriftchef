import type { RetailerCategory } from "../../contracts/retailerCategory";

/**
 * Tesco's categories are ordinary retailer categories; the alias is for
 * readability at the call sites that only deal with Tesco.
 */
export type TescoCategory = RetailerCategory & {
  /** What a meal plan uses this department for. Diagnostics and coverage only. */
  roleTags?: string[];
};

/**
 * A curated allowlist of the departments a meal plan can actually shop from.
 *
 * Not a scraped department tree. Walking Tesco's navigation would collect
 * alcohol, pharmacy, pet care, clothing and homeware — none of which can
 * contribute to a weekly meal plan, all of which multiply crawl time, and some
 * of which have no business in a shopping list this product generates.
 *
 * Ordering matters: categories are crawled in sequence, so the departments a
 * plan depends on most (proteins, vegetables, staples) come first and a
 * bounded run still ends up with a usable spread.
 *
 * Product identity is Tesco's numeric product id, so an item appearing in
 * several departments is merged rather than duplicated.
 *
 * ROUTE FORMAT — verified 2026-08-22. Tesco serves grocery departments from
 * `https://www.tesco.com/groceries/en-GB/shop/<superdepartment>[/<aisle>]/all`.
 * The `/all` suffix asks for the products in a department rather than the
 * shelves beneath it, and is what makes an aisle-level URL render tiles at
 * all.
 *
 * The URLs below are what a crawl requests, not what it lands on: a live
 * capture the same day showed Tesco answering `/groceries/en-GB/shop/...` with
 * a 200 and redirecting to `/shop/en-GB/browse/...`, which renders the
 * listing. A mistyped or retired slug still answers "Not down this aisle" and
 * still fails loudly; that guard is unchanged. The one thing not to conclude
 * from the redirect is that the `/shop/` family is dead — it is currently the
 * family Tesco serves from.
 *
 * VERIFICATION GATE — the superdepartment slugs and the aisle slugs marked
 * below are confirmed against live Tesco URLs; the rest follow the same
 * naming rule but have not each been opened. The bounded diagnostic is what
 * confirms them, and a wrong slug now fails loudly rather than silently: a
 * retired or mistyped route raises TESCO_ROUTE_NOT_FOUND, and a live route
 * whose tiles will not read raises TESCO_SELECTOR_DRIFT. Correct any slug the
 * diagnostic reports before a persistent crawl.
 */
const SHOP = "https://www.tesco.com/groceries/en-GB/shop";

/**
 * The single department a bounded diagnostic opens.
 *
 * Deliberately the superdepartment rather than the first crawl category: it
 * is the one route confirmed to render against the live site, and a
 * diagnostic exists to prove the selectors still match — which it can only do
 * from a page that renders. It is not part of TESCO_CATEGORIES because
 * crawling it would duplicate every aisle beneath it.
 */
export const TESCO_DIAGNOSTIC_CATEGORY: TescoCategory = {
  key: "diagnostic-fresh-food",
  url: `${SHOP}/fresh-food/all`,
  categoryPath: ["Fresh Food"],
  enabled: true,
};

export const TESCO_CATEGORIES: TescoCategory[] = [
  // --- Fresh food: the backbone of a meal plan ----------------------------
  {
    // Confirmed live. Renamed by Tesco: the old `fresh-vegetables` slug is
    // gone and flowers now share the aisle. The flowers are dropped by the
    // planner rather than by the crawl; a wrong slug reads nothing at all.
    key: "fresh-vegetables",
    url: `${SHOP}/fresh-food/fresh-vegetables-and-fresh-flowers/all`,
    categoryPath: ["Fresh Food", "Fresh Vegetables & Fresh Flowers"],
    enabled: true,
    roleTags: ["vegetable"],
  },
  {
    // Confirmed live.
    key: "fresh-fruit",
    url: `${SHOP}/fresh-food/fresh-fruit/all`,
    categoryPath: ["Fresh Food", "Fresh Fruit"],
    enabled: true,
    roleTags: ["fruit"],
  },
  {
    // Confirmed live. Renamed: turkey is no longer part of the chicken aisle.
    key: "fresh-poultry",
    url: `${SHOP}/fresh-food/fresh-meat-and-poultry/fresh-chicken/all`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Fresh Chicken"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    // Confirmed live.
    key: "fresh-beef",
    url: `${SHOP}/fresh-food/fresh-meat-and-poultry/fresh-beef/all`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Fresh Beef"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    // Confirmed live. Renamed: gammon now shares the pork aisle.
    key: "fresh-pork",
    url: `${SHOP}/fresh-food/fresh-meat-and-poultry/fresh-pork-and-gammon/all`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Fresh Pork & Gammon"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-lamb",
    url: `${SHOP}/fresh-food/fresh-meat-and-poultry/fresh-lamb/all`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Fresh Lamb"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-bacon-and-sausages",
    url: `${SHOP}/fresh-food/fresh-meat-and-poultry/bacon-and-sausages/all`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Bacon & Sausages"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-fish-and-seafood",
    url: `${SHOP}/fresh-food/fresh-fish-and-seafood/all`,
    categoryPath: ["Fresh Food", "Fresh Fish & Seafood"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-salad-and-herbs",
    url: `${SHOP}/fresh-food/fresh-salad-and-dips/salad-and-herbs/all`,
    categoryPath: ["Fresh Food", "Fresh Salad & Dips", "Salad & Herbs"],
    enabled: true,
    roleTags: ["vegetable"],
  },

  // --- Dairy, eggs and alternatives ---------------------------------------
  {
    key: "dairy-milk",
    url: `${SHOP}/fresh-food/milk-butter-and-eggs/milk/all`,
    categoryPath: ["Fresh Food", "Milk, Butter & Eggs", "Milk"],
    enabled: true,
    roleTags: ["dairy"],
  },
  {
    key: "dairy-eggs",
    url: `${SHOP}/fresh-food/milk-butter-and-eggs/eggs/all`,
    categoryPath: ["Fresh Food", "Milk, Butter & Eggs", "Eggs"],
    enabled: true,
    roleTags: ["protein", "dairy"],
  },
  {
    key: "dairy-butter-and-spreads",
    url: `${SHOP}/fresh-food/milk-butter-and-eggs/butter-and-spreads/all`,
    categoryPath: ["Fresh Food", "Milk, Butter & Eggs", "Butter & Spreads"],
    enabled: true,
    roleTags: ["dairy"],
  },
  {
    key: "dairy-cheese",
    url: `${SHOP}/fresh-food/cheese/all`,
    categoryPath: ["Fresh Food", "Cheese"],
    enabled: true,
    roleTags: ["dairy", "protein"],
  },
  {
    key: "dairy-yogurts",
    url: `${SHOP}/fresh-food/yogurts/all`,
    categoryPath: ["Fresh Food", "Yogurts"],
    enabled: true,
    roleTags: ["dairy"],
  },
  {
    key: "dairy-alternatives",
    url: `${SHOP}/fresh-food/free-from-and-dairy-alternatives/all`,
    categoryPath: ["Fresh Food", "Free From & Dairy Alternatives"],
    enabled: true,
    roleTags: ["dairy"],
  },

  // --- Bakery -------------------------------------------------------------
  {
    key: "bakery-bread",
    url: `${SHOP}/bakery/bread/all`,
    categoryPath: ["Bakery", "Bread"],
    enabled: true,
    roleTags: ["starch"],
  },
  {
    key: "bakery-rolls-wraps-and-bagels",
    url: `${SHOP}/bakery/rolls-wraps-and-bagels/all`,
    categoryPath: ["Bakery", "Rolls, Wraps & Bagels"],
    enabled: true,
    roleTags: ["starch"],
  },

  // --- Store cupboard staples ---------------------------------------------
  {
    key: "cupboard-rice-pasta-and-noodles",
    url: `${SHOP}/food-cupboard/dried-pasta-rice-noodles-and-cous-cous/all`,
    categoryPath: ["Food Cupboard", "Dried Pasta, Rice, Noodles & Cous Cous"],
    enabled: true,
    roleTags: ["starch"],
  },
  {
    key: "cupboard-tins-and-cans",
    url: `${SHOP}/food-cupboard/tins-cans-and-packets/all`,
    categoryPath: ["Food Cupboard", "Tins, Cans & Packets"],
    enabled: true,
    roleTags: ["protein", "vegetable"],
  },
  {
    key: "cupboard-cooking-ingredients",
    url: `${SHOP}/food-cupboard/cooking-ingredients/all`,
    categoryPath: ["Food Cupboard", "Cooking Ingredients"],
    enabled: true,
    roleTags: ["flavour"],
  },
  {
    key: "cupboard-herbs-and-spices",
    url: `${SHOP}/food-cupboard/cooking-ingredients/herbs-and-spices/all`,
    categoryPath: ["Food Cupboard", "Cooking Ingredients", "Herbs & Spices"],
    enabled: true,
    roleTags: ["flavour"],
  },
  {
    key: "cupboard-sauces-and-condiments",
    url: `${SHOP}/food-cupboard/cooking-sauces-meal-kits-and-sides/all`,
    categoryPath: ["Food Cupboard", "Cooking Sauces, Meal Kits & Sides"],
    enabled: true,
    roleTags: ["flavour"],
  },
  {
    key: "cupboard-cereals",
    url: `${SHOP}/food-cupboard/cereals/all`,
    categoryPath: ["Food Cupboard", "Cereals"],
    enabled: true,
    roleTags: ["starch", "breakfast"],
  },
  {
    key: "cupboard-beans-and-pulses",
    url: `${SHOP}/food-cupboard/tins-cans-and-packets/beans-and-pulses/all`,
    categoryPath: ["Food Cupboard", "Tins, Cans & Packets", "Beans & Pulses"],
    enabled: true,
    roleTags: ["protein"],
  },

  // --- Frozen -------------------------------------------------------------
  // These aisle slugs dropped their "frozen-" prefix when the department
  // moved: they already sit inside `frozen-food`.
  {
    key: "frozen-vegetables",
    url: `${SHOP}/frozen-food/vegetables/all`,
    categoryPath: ["Frozen Food", "Vegetables"],
    enabled: true,
    roleTags: ["vegetable"],
  },
  {
    key: "frozen-meat-and-poultry",
    url: `${SHOP}/frozen-food/meat-and-poultry/all`,
    categoryPath: ["Frozen Food", "Meat & Poultry"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    // Confirmed live.
    key: "frozen-fish-and-seafood",
    url: `${SHOP}/frozen-food/fish-and-seafood/all`,
    categoryPath: ["Frozen Food", "Fish & Seafood"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "frozen-potatoes",
    url: `${SHOP}/frozen-food/chips-potatoes-and-sides/all`,
    categoryPath: ["Frozen Food", "Chips, Potatoes & Sides"],
    enabled: true,
    roleTags: ["starch"],
  },

  // --- Vegetarian and vegan proteins --------------------------------------
  {
    key: "plant-based-chilled",
    url: `${SHOP}/fresh-food/vegetarian-and-vegan/all`,
    categoryPath: ["Fresh Food", "Vegetarian & Vegan"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "plant-based-frozen",
    url: `${SHOP}/frozen-food/vegetarian-and-vegan/all`,
    categoryPath: ["Frozen Food", "Vegetarian & Vegan"],
    enabled: true,
    roleTags: ["protein"],
  },
];

/**
 * Departments that exist on tesco.com and are deliberately not crawled.
 *
 * Recorded rather than merely omitted so the exclusion is a decision someone
 * can review, and so a future contributor adding a category has to say why
 * one of these changed. Alcohol, tobacco and pharmacy are excluded on
 * product-safety grounds as well as relevance; the rest cannot appear in a
 * meal plan at all.
 */
export const TESCO_EXCLUDED_DEPARTMENTS = [
  "beer-wine-and-spirits",
  "tobacco",
  "health-and-beauty",
  "pharmacy",
  "baby-and-toddler",
  "pets",
  "household",
  "home-and-garden",
  "clothing",
  "electricals",
  "entertainment",
  "seasonal",
  // MVP exclusions: part of a real basket, not of a meal plan.
  "drinks",
  "sweets-and-confectionery",
] as const;
