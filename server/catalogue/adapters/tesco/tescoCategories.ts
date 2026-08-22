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
 * VERIFICATION GATE — the browse paths below follow the URL shape the
 * specification records (`/shop/en-GB/browse/...` on www.tesco.com) but no
 * live Tesco session has confirmed the individual department slugs. The first
 * no-write diagnostic is what confirms them, and the crawl fails loudly rather
 * than silently on a wrong path: a category that returns no readable tiles is
 * selector drift, not an empty shelf. Correct any slug that the diagnostic
 * shows to be wrong before a persistent crawl.
 */
const BROWSE = "https://www.tesco.com/shop/en-GB/browse";

export const TESCO_CATEGORIES: TescoCategory[] = [
  // --- Fresh food: the backbone of a meal plan ----------------------------
  {
    key: "fresh-vegetables",
    url: `${BROWSE}/fresh-food/fresh-vegetables`,
    categoryPath: ["Fresh Food", "Fresh Vegetables"],
    enabled: true,
    roleTags: ["vegetable"],
  },
  {
    key: "fresh-fruit",
    url: `${BROWSE}/fresh-food/fresh-fruit`,
    categoryPath: ["Fresh Food", "Fresh Fruit"],
    enabled: true,
    roleTags: ["fruit"],
  },
  {
    key: "fresh-poultry",
    url: `${BROWSE}/fresh-food/fresh-meat-and-poultry/fresh-chicken-and-turkey`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Chicken & Turkey"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-beef",
    url: `${BROWSE}/fresh-food/fresh-meat-and-poultry/fresh-beef`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Beef"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-pork",
    url: `${BROWSE}/fresh-food/fresh-meat-and-poultry/fresh-pork`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Pork"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-lamb",
    url: `${BROWSE}/fresh-food/fresh-meat-and-poultry/fresh-lamb`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Lamb"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-bacon-and-sausages",
    url: `${BROWSE}/fresh-food/fresh-meat-and-poultry/bacon-and-sausages`,
    categoryPath: ["Fresh Food", "Fresh Meat & Poultry", "Bacon & Sausages"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-fish-and-seafood",
    url: `${BROWSE}/fresh-food/fresh-fish-and-seafood`,
    categoryPath: ["Fresh Food", "Fresh Fish & Seafood"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "fresh-salad-and-herbs",
    url: `${BROWSE}/fresh-food/fresh-salad-and-dips/salad-and-herbs`,
    categoryPath: ["Fresh Food", "Fresh Salad & Dips", "Salad & Herbs"],
    enabled: true,
    roleTags: ["vegetable"],
  },

  // --- Dairy, eggs and alternatives ---------------------------------------
  {
    key: "dairy-milk",
    url: `${BROWSE}/fresh-food/milk-butter-and-eggs/milk`,
    categoryPath: ["Fresh Food", "Milk, Butter & Eggs", "Milk"],
    enabled: true,
    roleTags: ["dairy"],
  },
  {
    key: "dairy-eggs",
    url: `${BROWSE}/fresh-food/milk-butter-and-eggs/eggs`,
    categoryPath: ["Fresh Food", "Milk, Butter & Eggs", "Eggs"],
    enabled: true,
    roleTags: ["protein", "dairy"],
  },
  {
    key: "dairy-butter-and-spreads",
    url: `${BROWSE}/fresh-food/milk-butter-and-eggs/butter-and-spreads`,
    categoryPath: ["Fresh Food", "Milk, Butter & Eggs", "Butter & Spreads"],
    enabled: true,
    roleTags: ["dairy"],
  },
  {
    key: "dairy-cheese",
    url: `${BROWSE}/fresh-food/cheese`,
    categoryPath: ["Fresh Food", "Cheese"],
    enabled: true,
    roleTags: ["dairy", "protein"],
  },
  {
    key: "dairy-yogurts",
    url: `${BROWSE}/fresh-food/yogurts`,
    categoryPath: ["Fresh Food", "Yogurts"],
    enabled: true,
    roleTags: ["dairy"],
  },
  {
    key: "dairy-alternatives",
    url: `${BROWSE}/fresh-food/free-from-and-dairy-alternatives`,
    categoryPath: ["Fresh Food", "Free From & Dairy Alternatives"],
    enabled: true,
    roleTags: ["dairy"],
  },

  // --- Bakery -------------------------------------------------------------
  {
    key: "bakery-bread",
    url: `${BROWSE}/bakery/bread`,
    categoryPath: ["Bakery", "Bread"],
    enabled: true,
    roleTags: ["starch"],
  },
  {
    key: "bakery-rolls-wraps-and-bagels",
    url: `${BROWSE}/bakery/rolls-wraps-and-bagels`,
    categoryPath: ["Bakery", "Rolls, Wraps & Bagels"],
    enabled: true,
    roleTags: ["starch"],
  },

  // --- Store cupboard staples ---------------------------------------------
  {
    key: "cupboard-rice-pasta-and-noodles",
    url: `${BROWSE}/food-cupboard/rice-pasta-and-noodles`,
    categoryPath: ["Food Cupboard", "Rice, Pasta & Noodles"],
    enabled: true,
    roleTags: ["starch"],
  },
  {
    key: "cupboard-tins-and-cans",
    url: `${BROWSE}/food-cupboard/tins-cans-and-packets`,
    categoryPath: ["Food Cupboard", "Tins, Cans & Packets"],
    enabled: true,
    roleTags: ["protein", "vegetable"],
  },
  {
    key: "cupboard-cooking-ingredients",
    url: `${BROWSE}/food-cupboard/cooking-ingredients`,
    categoryPath: ["Food Cupboard", "Cooking Ingredients"],
    enabled: true,
    roleTags: ["flavour"],
  },
  {
    key: "cupboard-herbs-and-spices",
    url: `${BROWSE}/food-cupboard/cooking-ingredients/herbs-and-spices`,
    categoryPath: ["Food Cupboard", "Cooking Ingredients", "Herbs & Spices"],
    enabled: true,
    roleTags: ["flavour"],
  },
  {
    key: "cupboard-sauces-and-condiments",
    url: `${BROWSE}/food-cupboard/condiments-and-sauces`,
    categoryPath: ["Food Cupboard", "Condiments & Sauces"],
    enabled: true,
    roleTags: ["flavour"],
  },
  {
    key: "cupboard-cereals",
    url: `${BROWSE}/food-cupboard/breakfast-cereals`,
    categoryPath: ["Food Cupboard", "Breakfast Cereals"],
    enabled: true,
    roleTags: ["starch", "breakfast"],
  },
  {
    key: "cupboard-beans-and-pulses",
    url: `${BROWSE}/food-cupboard/tins-cans-and-packets/beans-and-pulses`,
    categoryPath: ["Food Cupboard", "Tins, Cans & Packets", "Beans & Pulses"],
    enabled: true,
    roleTags: ["protein"],
  },

  // --- Frozen -------------------------------------------------------------
  {
    key: "frozen-vegetables",
    url: `${BROWSE}/frozen-food/frozen-vegetables`,
    categoryPath: ["Frozen Food", "Frozen Vegetables"],
    enabled: true,
    roleTags: ["vegetable"],
  },
  {
    key: "frozen-meat-and-poultry",
    url: `${BROWSE}/frozen-food/frozen-meat-and-poultry`,
    categoryPath: ["Frozen Food", "Frozen Meat & Poultry"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "frozen-fish-and-seafood",
    url: `${BROWSE}/frozen-food/frozen-fish-and-seafood`,
    categoryPath: ["Frozen Food", "Frozen Fish & Seafood"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "frozen-potatoes",
    url: `${BROWSE}/frozen-food/frozen-chips-and-potatoes`,
    categoryPath: ["Frozen Food", "Frozen Chips & Potatoes"],
    enabled: true,
    roleTags: ["starch"],
  },

  // --- Vegetarian and vegan proteins --------------------------------------
  {
    key: "plant-based-chilled",
    url: `${BROWSE}/fresh-food/vegetarian-and-vegan/chilled-vegetarian-and-vegan`,
    categoryPath: ["Fresh Food", "Vegetarian & Vegan", "Chilled"],
    enabled: true,
    roleTags: ["protein"],
  },
  {
    key: "plant-based-frozen",
    url: `${BROWSE}/frozen-food/frozen-vegetarian-and-vegan`,
    categoryPath: ["Frozen Food", "Frozen Vegetarian & Vegan"],
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
