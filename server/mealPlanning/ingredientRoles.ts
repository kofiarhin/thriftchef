/**
 * Culinary roles describe how an ingredient can be *used*, which is what a
 * recipe needs to know. The broad food groups in `productCategories.ts` answer
 * a different question — how to keep a selection balanced — and are far too
 * coarse to fill a recipe slot: "dairy" cannot distinguish the milk you pour on
 * cereal from the cheese you grate over pasta.
 *
 * Classification is pure, deterministic and case-insensitive. A product may
 * hold several roles, because many genuinely do. A product that matches nothing
 * is `unknown`, and an unknown product can never fill a required slot — the
 * planner discards the template instead of substituting something unrelated.
 * That rule is what stops a "Pasta and Pâté Breakfast" from ever being built.
 */

export const INGREDIENT_ROLES = [
  "egg",
  "breakfast_cereal",
  "bread",
  "wrap",
  "rice",
  "pasta",
  "potato",
  "other_starch",
  "poultry",
  "red_meat",
  "fish",
  "plant_protein",
  "cheese",
  "yogurt",
  "milk",
  "leafy_vegetable",
  "other_vegetable",
  "fruit",
  "sauce",
  "seasoning",
  "snack",
  "unknown",
] as const;

export type IngredientRole = (typeof INGREDIENT_ROLES)[number];

export interface RoleClassifierInput {
  name: string;
  description: string | null;
  categoryPaths: string[][];
}

/**
 * One classification rule. `unless` exists because English food names borrow
 * each other's words constantly: "milk chocolate" is not milk, "cheesecake" is
 * not cheese, and "chicken stock" is a seasoning rather than a poultry portion.
 * Without these guards a classifier reads far too generously and puts the wrong
 * product in a required slot — the exact failure this module prevents.
 */
interface RoleRule {
  role: IngredientRole;
  match: RegExp;
  unless?: RegExp;
}

const RULES: RoleRule[] = [
  {
    role: "egg",
    match: /\beggs?\b/,
    // Egg noodles and egg fried rice are starches that merely mention eggs.
    unless: /\begg (noodle|fried rice)|\bnoodles?\b|mayonnaise/,
  },
  {
    role: "breakfast_cereal",
    match:
      /\b(porridge|oats|oatmeal|cereal|granola|muesli|cornflakes|corn flakes|weetabix|shreddies|bran flakes|puffed wheat)\b/,
    unless: /\b(oat (milk|drink)|biscuit|bar|cookie)\b/,
  },
  {
    role: "bread",
    match: /\b(bread|loaf|baguette|bagels?|rolls?|crumpets?|muffins?|brioche|ciabatta)\b/,
    // Breadcrumbs coat things, shortbread is a biscuit, and a "sausage roll"
    // is not a bread roll.
    unless: /\b(breadcrumbs?|shortbread|gingerbread|sausage rolls?|pudding)\b/,
  },
  {
    role: "wrap",
    match: /\b(wraps?|tortillas?|pitta|pita|naan|flatbreads?|chapati)\b/,
    unless: /\bcrisps?\b|\bchips\b/,
  },
  {
    role: "rice",
    match: /\brice\b/,
    unless: /\b(rice (pudding|cakes?|krispies|drink|milk)|egg fried rice)\b/,
  },
  {
    role: "pasta",
    match:
      /\b(pasta|spaghetti|penne|fusilli|macaroni|tagliatelle|linguine|lasagne sheets|conchiglie|rigatoni)\b/,
    // "Pasta sauce" and "pasta bake sauce" belong in the sauce aisle.
    unless: /\b(sauce|pot|salad|ready meal)\b/,
  },
  {
    role: "potato",
    match: /\b(potatoes?|maris piper|king edward)\b/,
    // Crisps are a snack however potato-shaped they are.
    unless: /\b(crisps?|snack|waffles?|croquettes?)\b/,
  },
  {
    role: "other_starch",
    match: /\b(couscous|quinoa|bulgur|noodles?|gnocchi|polenta|tortilla chips)\b/,
    unless: /\bsoup\b/,
  },
  {
    role: "poultry",
    match: /\b(chicken|turkey|duck|poultry)\b/,
    // Stock cubes and gravy granules flavour a dish; they do not fill a
    // protein slot.
    unless: /\b(stock|gravy|seasoning|granules|soup|flavour|flavoured|crisps?)\b/,
  },
  {
    role: "red_meat",
    match:
      /\b(beef|pork|lamb|gammon|bacon|sausages?|ham|steaks?|mince|venison|meatballs?|chorizo|salami|ribeye|rib eye|sirloin|rump|brisket|shanks?|burgers?|quarter pounders?|pounders?|grillsteaks?)\b/,
    unless: /\b(stock|gravy granules?|granules|flavour|flavoured|crisps?|quorn|vegan|meat.?free|fish|salmon|tuna|cod|haddock|pollock|basa|prawns?)\b/,
  },
  {
    role: "fish",
    match:
      /\b(fish|salmon|tuna|cod|haddock|prawns?|mackerel|sardines?|pollock|basa|seafood|crab)\b/,
    unless: /\b(stock|flavour|flavoured|cat|dog)\b/,
  },
  {
    role: "plant_protein",
    match:
      /\b(lentils?|chickpeas?|butter beans|kidney beans|baked beans|black beans|tofu|quorn|falafel|hummus|houmous|soya mince|meat.?free|vegan[a-z ]*(mince|burgers?|sausages?|pounders?))\b/,
  },
  {
    role: "cheese",
    match:
      /\b(cheese|cheddar|mozzarella|feta|halloumi|parmesan|brie|camembert|paneer|red leicester)\b/,
    // A cheesecake is a dessert and cheese puffs are crisps.
    unless: /\b(cheesecake|puffs|crisps?|flavour|flavoured|biscuits?|crispbakes?)\b/,
  },
  {
    role: "yogurt",
    match: /\b(yogh?urts?|skyr|fromage frais)\b/,
    unless: /\b(coated|covered|raisins|biscuits?|bars?|granola)\b/,
  },
  {
    role: "milk",
    match: /\b(milk|semi skimmed|whole milk|single cream|double cream)\b/,
    // Milk chocolate, coconut milk and milkshakes are not the pint of milk a
    // porridge recipe is asking for.
    unless:
      /\b(milk chocolate|chocolate|coconut milk|milkshakes?|condensed|evaporated|powder|biscuits?)\b/,
  },
  {
    role: "leafy_vegetable",
    match:
      /\b(spinach|lettuce|kale|rocket|salad leaves|mixed salad|cabbage|pak choi|chard|watercress)\b/,
    unless: /\bsoup\b/,
  },
  {
    role: "other_vegetable",
    match:
      /\b(carrots?|broccoli|cauliflower|peppers?|onions?|courgettes?|aubergines?|mushrooms?|peas|sweetcorn|green beans|leeks?|celery|beetroot|butternut|squash|tomatoes?|vegetables?|stir fry|salad)\b/,
    unless: /\b(soup|crisps?|ketchup|puree|purée|juice|crispbakes?)\b/,
  },
  {
    role: "fruit",
    match:
      /\b(apples?|bananas?|oranges?|grapes?|berries|strawberr|raspberr|blueberr|melon|mango|pears?|pineapple|peaches?|plums?|kiwi|fruit|satsumas?|clementines?)\b/,
    unless: /\b(juice|squash|flavour|flavoured|yogh?urt|snack|sweets?|pastilles?|pate|terrine|cider|chutney|pickles?|pudding|sponge|cake|tart|crumble|trifle|gateau|mousse|custard|cheesecake|dessert)\b/,
  },
  {
    role: "sauce",
    match:
      /\b(sauces?|ketchup|mayonnaise|passata|pesto|chopped tomatoes|curry paste|soy sauce|dressings?|oils?|vinegar|chutney|salsa|gravy)\b/,
    unless: /\bpasta salad\b/,
  },
  {
    role: "seasoning",
    match:
      /\b(salt|peppercorns?|spices?|herbs?|seasoning|stock cubes?|paprika|cumin|oregano|basil|cinnamon|turmeric|garlic granules|curry powder|bouillon)\b/,
  },
  {
    role: "snack",
    match:
      /\b(crisps?|chocolates?|biscuits?|crackers?|sweets?|cakes?|popcorn|nuts|peanuts|cashews|almonds|ice cream|cookies?|wafers?|shortbread|flapjacks?)\b/,
  },
];

/** Combining marks left behind by NFD decomposition. */
const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Punctuation becomes whitespace so word boundaries survive hyphens and "&".
 *
 * Accents are folded rather than dropped: stripping them outright turned
 * "pâté" into "p t", which no rule could match and no guard could exclude —
 * that is how an Apple Cider Pâté once filled a fruit slot.
 */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Centre-of-plate roles. A product whose name states one of these is that
 * protein, whatever else the name mentions: the remaining food words describe
 * how it was flavoured, sauced or served. Reading them as ingredients in their
 * own right is what let a sausage fill the fruit slot of a yogurt bowl and a
 * fish ready meal fill a cheese, spinach and sauce slot at once.
 */
const PRIMARY_ROLES: readonly IngredientRole[] = [
  "poultry",
  "red_meat",
  "fish",
  "egg",
  "plant_protein",
];

/** Drops the descriptive roles once the product has named a protein. */
function primaryRolesOnly(roles: IngredientRole[]): IngredientRole[] {
  const primary = roles.filter((role) => PRIMARY_ROLES.includes(role));
  return primary.length > 0 ? primary : roles;
}

/** Applies every rule to one already-normalized string, in declaration order. */
function rolesFrom(haystack: string): IngredientRole[] {
  const roles: IngredientRole[] = [];
  if (!haystack) return roles;

  // Rule order is the declaration order above, so the returned list is stable
  // for a given product and safe to use in canonical signatures.
  for (const rule of RULES) {
    if (roles.includes(rule.role)) continue;
    if (!rule.match.test(haystack)) continue;
    if (rule.unless?.test(haystack)) continue;

    roles.push(rule.role);
  }

  return roles;
}

/**
 * What the product says about itself. Aldi names are terse but they are the
 * only statement that describes *this* product rather than its neighbours.
 */
function statedRoles(input: RoleClassifierInput): IngredientRole[] {
  return rolesFrom(normalize([input.name, input.description ?? ""].join(" ")));
}

/**
 * The aisle, consulted only when the product says nothing about itself
 * ("Everyday Essentials Fillets" is only ever explained by "Poultry").
 *
 * A segment is read whole and must name exactly one role to count. Aldi
 * shelves compound aisles — "Rice, Pasta & Noodles", "Meat & Poultry" — and an
 * aisle listing several foods cannot say which one the product is. Letting it
 * grant all of them is what made soba noodles eligible for a rice slot.
 */
function aisleRoles(input: RoleClassifierInput): IngredientRole[] {
  const roles: IngredientRole[] = [];

  for (const segment of input.categoryPaths.flat()) {
    const candidates = rolesFrom(normalize(segment));
    if (candidates.length !== 1) continue;
    if (!roles.includes(candidates[0])) roles.push(candidates[0]);
  }

  return roles;
}

export function classifyIngredientRoles(
  input: RoleClassifierInput,
): IngredientRole[] {
  const stated = statedRoles(input);
  if (stated.length > 0) return primaryRolesOnly(stated);

  const aisle = aisleRoles(input);
  return aisle.length > 0 ? aisle : ["unknown"];
}

export function hasRole(roles: IngredientRole[], role: IngredientRole): boolean {
  return roles.includes(role);
}

/** True when a product can fill a slot accepting any of `acceptedRoles`. */
export function fillsAnyRole(
  roles: IngredientRole[],
  acceptedRoles: IngredientRole[],
): boolean {
  return acceptedRoles.some((role) => role !== "unknown" && roles.includes(role));
}
