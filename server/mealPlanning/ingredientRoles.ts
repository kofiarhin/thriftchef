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
      /\b(beef|pork|lamb|gammon|bacon|sausages?|ham|steaks?|mince|venison|meatballs?|chorizo|salami)\b/,
    unless: /\b(stock|gravy|granules|flavour|flavoured|crisps?|quorn|vegan|meat.?free)\b/,
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
      /\b(lentils?|chickpeas?|butter beans|kidney beans|baked beans|black beans|tofu|quorn|falafel|hummus|houmous|soya mince|meat.?free|vegan (mince|burgers?|sausages?))\b/,
  },
  {
    role: "cheese",
    match:
      /\b(cheese|cheddar|mozzarella|feta|halloumi|parmesan|brie|camembert|paneer|red leicester)\b/,
    // A cheesecake is a dessert and cheese puffs are crisps.
    unless: /\b(cheesecake|puffs|crisps?|flavour|flavoured|biscuits?)\b/,
  },
  {
    role: "yogurt",
    match: /\b(yogh?urts?|skyr|fromage frais)\b/,
    unless: /\b(coated|covered|raisins)\b/,
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
    unless: /\b(soup|crisps?|ketchup|puree|purée|juice)\b/,
  },
  {
    role: "fruit",
    match:
      /\b(apples?|bananas?|oranges?|grapes?|berries|strawberr|raspberr|blueberr|melon|mango|pears?|pineapple|peaches?|plums?|kiwi|fruit|satsumas?|clementines?)\b/,
    unless: /\b(juice|squash|flavour|flavoured|yogh?urt|snack|sweets?|pastilles?)\b/,
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

/** Punctuation becomes whitespace so word boundaries survive hyphens and "&". */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Name, description and every category segment are searched together. Aldi
 * names are terse ("Everyday Essentials Fillets") and the category path is
 * often the only thing that says what the product actually is.
 */
function haystackFrom(input: RoleClassifierInput): string {
  const parts = [input.name, input.description ?? "", ...input.categoryPaths.flat()];
  return normalize(parts.join(" "));
}

export function classifyIngredientRoles(
  input: RoleClassifierInput,
): IngredientRole[] {
  const haystack = haystackFrom(input);
  if (!haystack) return ["unknown"];

  const roles: IngredientRole[] = [];

  // Rule order is the declaration order above, so the returned list is stable
  // for a given product and safe to use in canonical signatures.
  for (const rule of RULES) {
    if (roles.includes(rule.role)) continue;
    if (!rule.match.test(haystack)) continue;
    if (rule.unless?.test(haystack)) continue;

    roles.push(rule.role);
  }

  return roles.length > 0 ? roles : ["unknown"];
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
