/**
 * Aldi UK publishes no ingredient or allergen data on its product pages, so
 * the catalogue cannot record allergens as fact. This module infers the likely
 * UK-regulated allergens from the words a retailer does publish — product name,
 * brand, description and category.
 *
 * Inference is a heuristic, never a substitute for the label. Anything derived
 * here must be surfaced to users as inferred, and products carrying inferred
 * allergens must never be presented as allergen-safe.
 */

/** The 14 allergens that UK food law requires to be declared. */
export type InferredAllergen =
  | "celery"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "gluten"
  | "lupin"
  | "milk"
  | "molluscs"
  | "mustard"
  | "peanuts"
  | "sesame"
  | "soya"
  | "sulphites"
  | "tree nuts";

/**
 * Patterns are matched against whole words only, so "Butternut Squash" does
 * not read as butter and "Peanuts" does not read as tree nuts.
 */
const ALLERGEN_PATTERNS: Array<[InferredAllergen, RegExp]> = [
  ["celery", /\b(celery|celeriac)\b/],
  [
    "crustaceans",
    /\b(prawns?|shrimps?|crabs?|lobsters?|langoustines?|crayfish|scampi|crustaceans?)\b/,
  ],
  ["eggs", /\b(eggs?|omelettes?|mayonnaise|meringues?|frittatas?)\b/],
  [
    "fish",
    /\b(fish|fishcakes?|salmon|tuna|cod|haddock|mackerel|sardines?|anchovy|anchovies|pollock|basa|seabass|trout|kippers?|plaice|hake|whitebait)\b/,
  ],
  [
    "gluten",
    /\b(wheat|barley|rye|spelt|semolina|couscous|bread|breads|breaded|breadcrumbs?|batter|battered|brioche|baguettes?|ciabattas?|bagels?|naans?|pittas?|wraps?|tortillas?|crumpets?|muffins?|scones?|croissants?|pastr(?:y|ies)|pies?|pasta|spaghetti|penne|fusilli|macaroni|lasagne|tagliatelle|linguine|noodles?|ramen|dumplings?|gnocchi|flour|cakes?|biscuits?|cookies?|crackers?|cereals?|granola|muesli|weetabix|porridge|oats?|oatmeal|pizzas?|doughnuts?|waffles?|pancakes?|yorkshire puddings?|stuffing|rolls?|buns?|tarts?|crumbles?|beer|ale|lager|sausages?|kievs?|kyivs?|katsu|schnitzels?|goujons?|nuggets?|escalopes?|tempura|toad in the hole)\b/,
  ],
  ["lupin", /\blupins?\b/],
  [
    "milk",
    /\b(milk|milkshakes?|dairy|cheese|cheeses|cheddar|mozzarella|parmesan|brie|camembert|feta|halloumi|mascarpone|ricotta|stilton|gouda|edam|wensleydale|red leicester|butters?|buttery|buttermilk|ghee|cream|creams|creamy|creme|cr[eè]me|custard|yogh?urts?|yoghourt|ice cream|creamery|paneer|quark|curd)\b/,
  ],
  [
    "molluscs",
    /\b(molluscs?|mussels?|oysters?|squid|calamari|octopus|clams?|scallops?|whelks?|cockles?|snails?)\b/,
  ],
  ["mustard", /\b(mustard|dijon)\b/],
  ["peanuts", /\b(peanuts?|groundnuts?|satay)\b/],
  ["sesame", /\b(sesame|tahini|halva)\b/],
  ["soya", /\b(soya|soybeans?|soy|tofu|edamame|miso|tempeh)\b/],
  ["sulphites", /\b(sulphites?|sulfites?|sulphur dioxide)\b/],
  [
    "tree nuts",
    /\b(almonds?|hazelnuts?|walnuts?|cashews?|pecans?|brazil nuts?|pistachios?|macadamias?|pine nuts?|marzipan|praline|nutella|tree nuts?)\b/,
  ],
];

/**
 * Explicit "free from" claims override a keyword hit: a gluten free penne is
 * still called penne. Bare "free" is not a claim — "Free Range Eggs" is not
 * egg free.
 */
const FREE_FROM_PATTERNS: Array<[InferredAllergen, RegExp]> = [
  ["gluten", /\b(gluten[\s-]?free|free[\s-]from[\s-]gluten|wheat[\s-]?free)\b/],
  [
    "milk",
    /\b(dairy[\s-]?free|milk[\s-]?free|lactose[\s-]?free|free[\s-]from[\s-]dairy)\b/,
  ],
  ["eggs", /\b(egg[\s-]?free)\b/],
  ["peanuts", /\b(peanut[\s-]?free)\b/],
  ["tree nuts", /\b(nut[\s-]?free)\b/],
  ["soya", /\b(soya[\s-]?free|soy[\s-]?free)\b/],
];

/** A vegan claim rules out every allergen of animal origin. */
const VEGAN_PATTERN = /\b(vegan|plant[\s-]based)\b/;
const VEGAN_EXCLUDED: InferredAllergen[] = [
  "milk",
  "eggs",
  "fish",
  "crustaceans",
  "molluscs",
];

/**
 * "Peanut butter" and "cocoa butter" are not dairy. The qualifier is kept so
 * the nut itself is still detected; only the misleading "butter" is dropped.
 */
const NON_DAIRY_BUTTER =
  /\b(peanut|almond|cashew|hazelnut|walnut|pecan|pistachio|macadamia|nut|cocoa|shea|seed|sunflower|coconut)\s+butters?\b/g;

function normalizeForMatching(value: string): string {
  return value
    .toLowerCase()
    .replace(/[&,/()[\]{}'"`.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(NON_DAIRY_BUTTER, "$1");
}

/**
 * Infers the allergens a product's published text implies.
 * Returns a sorted, de-duplicated list; an empty list means "nothing detected",
 * NOT "confirmed allergen free".
 */
export function inferAllergens(text: string): InferredAllergen[] {
  const haystack = normalizeForMatching(text);
  if (!haystack) return [];

  const detected = new Set<InferredAllergen>();

  for (const [allergen, pattern] of ALLERGEN_PATTERNS) {
    if (pattern.test(haystack)) detected.add(allergen);
  }

  for (const [allergen, pattern] of FREE_FROM_PATTERNS) {
    if (pattern.test(haystack)) detected.delete(allergen);
  }

  if (VEGAN_PATTERN.test(haystack)) {
    for (const allergen of VEGAN_EXCLUDED) detected.delete(allergen);
  }

  return [...detected].sort();
}

/**
 * A handful of Aldi leaf categories name exactly one allergen and nothing
 * else. Unlike the multi-item labels, these are reliable: everything filed
 * under "Yogurts" contains milk, whatever the product happens to be called.
 *
 * Only unambiguous single-allergen leaves belong here. "Chilled Desserts" and
 * "Bakery" are deliberately absent — they mix products that do and do not
 * contain the allergen.
 */
const CATEGORY_ALLERGENS: Array<[InferredAllergen, RegExp]> = [
  ["milk", /^(milk|yogurts?|cheese|dairy)$/i],
  ["eggs", /^eggs$/i],
];

/**
 * Aldi stocks the dairy alternatives beside the dairy: oat, soya and almond
 * drinks sit in "Milk", soya pots in "Yogurts". Letting the aisle imply milk
 * for those would strip a milk-allergic shopper of the very products they can
 * eat, so an alternative's own wording overrides its aisle.
 */
const PLANT_BASE = /\b(soya|soy|almond|oat|coconut|hazelnut|cashew|hemp|pea)\b/;
const ALTERNATIVE_FORM = /\b(drinks?|alternatives?|pots?)\b/;

/** Rendered animal fats are filed under "Dairy" but contain no milk. */
const NON_DAIRY_FAT = /\b(lard|dripping|suet)\b|\b(goose|duck|beef|pork)\s+fat\b/;

/**
 * Whether a dairy aisle should be read as implying milk for this product.
 *
 * Wording always wins over shelf position, and it is the safety net here: a
 * product whose own name says yogurt, cream or cheese keeps its milk however
 * it is described, so clearing an alternative can never clear a real dairy
 * product by accident.
 */
function aisleImpliesMilk(haystack: string, fromText: InferredAllergen[]): boolean {
  if (fromText.includes("milk")) return true;
  if (NON_DAIRY_FAT.test(haystack)) return false;
  if (PLANT_BASE.test(haystack) && ALTERNATIVE_FORM.test(haystack)) return false;
  return true;
}

export interface AllergenAssessmentInput {
  name: string;
  brand?: string | null;
  description?: string | null;
  /** Every category path the product was seen under. Only leaves are read. */
  categoryPaths?: string[][];
}

/**
 * Allergens implied by the categories a product sits in, before any free-from
 * claim is applied.
 */
export function inferAllergensFromCategories(
  categoryPaths: string[][],
): InferredAllergen[] {
  const detected = new Set<InferredAllergen>();

  for (const path of categoryPaths) {
    const leaf = path.at(-1)?.trim();
    if (!leaf) continue;

    for (const [allergen, pattern] of CATEGORY_ALLERGENS) {
      if (pattern.test(leaf)) detected.add(allergen);
    }
  }

  return [...detected];
}

export interface AllergenAssessment {
  normalizedAllergens: InferredAllergen[];
  /** Terms that drove the inference, for auditing a wrong result. */
  inferredFrom: string;
}

/**
 * Builds the text inference runs against.
 *
 * Category is deliberately excluded. Aldi's categories are multi-item labels
 * ("Rice, Pasta & Noodles", "Bacon & Sausages", "Fish & Seafood"), so reading
 * them as ingredients marks every product in the category with every allergen
 * the label mentions — plain basmati rice came back as gluten. Only wording
 * that describes the product itself may drive inference.
 */
export function assessAllergens(
  input: AllergenAssessmentInput,
): AllergenAssessment {
  const inferredFrom = [input.brand ?? "", input.name, input.description ?? ""]
    .filter(Boolean)
    .join(" ");

  const fromText = inferAllergens(inferredFrom);
  const fromCategories = inferAllergensFromCategories(input.categoryPaths ?? []);

  // A free-from or vegan claim on the product still wins over its aisle: a
  // dairy-free spread filed under "Dairy" is not milk.
  const haystack = normalizeForMatching(inferredFrom);
  const detected = new Set<InferredAllergen>(fromText);

  for (const allergen of fromCategories) {
    if (allergen === "milk" && !aisleImpliesMilk(haystack, fromText)) continue;
    detected.add(allergen);
  }

  for (const [allergen, pattern] of FREE_FROM_PATTERNS) {
    if (pattern.test(haystack)) detected.delete(allergen);
  }

  if (VEGAN_PATTERN.test(haystack)) {
    for (const allergen of VEGAN_EXCLUDED) detected.delete(allergen);
  }

  return {
    normalizedAllergens: [...detected].sort(),
    inferredFrom,
  };
}
