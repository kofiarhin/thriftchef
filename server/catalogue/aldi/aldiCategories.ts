export interface AldiCategory {
  key: string;
  url: string;
  categoryPath: string[];
  enabled: boolean;
}

/**
 * Category URLs confirmed from the aldi.co.uk `/products` navigation.
 *
 * Scope follows the PRD: ThriftChef plans weekly meals and produces a grocery
 * shopping list, so only edible-grocery departments are enabled. Non-food
 * departments (SpecialBuys, Health & Beauty, Home Essentials, Pet Care,
 * Baby non-food) are deliberately absent rather than disabled — they can never
 * contribute to a meal plan.
 *
 * Alcohol and Drinks are present but disabled: they are part of a real Aldi
 * basket but not of a meal plan, and they roughly double crawl time. Flip
 * `enabled` to include them.
 *
 * Ordering matters. Categories are crawled in sequence, so the departments a
 * meal plan depends on most (proteins, vegetables, staples) come first.
 *
 * Product identity is Aldi's product ID, so items appearing in several
 * categories are merged rather than duplicated.
 */
export const ALDI_CATEGORIES: AldiCategory[] = [
  // --- Fresh Food: the backbone of a meal plan -----------------------------
  {
    key: "fresh-vegetables",
    url: "https://www.aldi.co.uk/products/fresh-food/vegetables/k/1588161416978050002",
    categoryPath: ["Fresh Food", "Vegetables"],
    enabled: true,
  },
  {
    key: "fresh-fruit",
    url: "https://www.aldi.co.uk/products/fresh-food/fruit/k/1588161416978050001",
    categoryPath: ["Fresh Food", "Fruit"],
    enabled: true,
  },
  {
    key: "fresh-poultry",
    url: "https://www.aldi.co.uk/products/fresh-food/poultry/k/1588161416978050004",
    categoryPath: ["Fresh Food", "Poultry"],
    enabled: true,
  },
  {
    key: "fresh-beef",
    url: "https://www.aldi.co.uk/products/fresh-food/beef/k/1588161416978050005",
    categoryPath: ["Fresh Food", "Beef"],
    enabled: true,
  },
  {
    key: "fresh-pork-gammon",
    url: "https://www.aldi.co.uk/products/fresh-food/pork-gammon/k/1588161416978050006",
    categoryPath: ["Fresh Food", "Pork & Gammon"],
    enabled: true,
  },
  {
    key: "fresh-bacon-sausages",
    url: "https://www.aldi.co.uk/products/fresh-food/bacon-sausages/k/1588161416978050007",
    categoryPath: ["Fresh Food", "Bacon & Sausages"],
    enabled: true,
  },
  {
    key: "fresh-lamb",
    url: "https://www.aldi.co.uk/products/fresh-food/lamb/k/1588161416978050008",
    categoryPath: ["Fresh Food", "Lamb"],
    enabled: true,
  },
  {
    key: "fresh-fish",
    url: "https://www.aldi.co.uk/products/fresh-food/fish/k/1588161416978050011",
    categoryPath: ["Fresh Food", "Fish"],
    enabled: true,
  },
  {
    key: "fresh-seafood-prawns",
    url: "https://www.aldi.co.uk/products/fresh-food/seafood-prawns/k/1588161416978050012",
    categoryPath: ["Fresh Food", "Seafood & Prawns"],
    enabled: true,
  },
  {
    key: "fresh-breaded-fish-fishcakes",
    url: "https://www.aldi.co.uk/products/fresh-food/breaded-fish-fishcakes/k/1588161416978050013",
    categoryPath: ["Fresh Food", "Breaded Fish & Fishcakes"],
    enabled: true,
  },
  {
    key: "fresh-stir-fry",
    url: "https://www.aldi.co.uk/products/fresh-food/stir-fry-vegetables-sauce-noodles/k/1588161416978050003",
    categoryPath: ["Fresh Food", "Stir Fry Vegetables, Sauce & Noodles"],
    enabled: true,
  },
  {
    key: "fresh-game-venison",
    url: "https://www.aldi.co.uk/products/fresh-food/game-venison/k/1588161416978050009",
    categoryPath: ["Fresh Food", "Game & Venison"],
    enabled: true,
  },
  {
    key: "fresh-black-pudding-haggis-stuffing",
    url: "https://www.aldi.co.uk/products/fresh-food/black-pudding-haggis-stuffing/k/1588161416978050010",
    categoryPath: ["Fresh Food", "Black Pudding, Haggis & Stuffing"],
    enabled: true,
  },

  // --- Food Cupboard: staples and store-cupboard ingredients ---------------
  {
    key: "cupboard-rice-pasta-noodles",
    url: "https://www.aldi.co.uk/products/food-cupboard/rice-pasta-noodles/k/1588161416978053008",
    categoryPath: ["Food Cupboard", "Rice, Pasta & Noodles"],
    enabled: true,
  },
  {
    key: "cupboard-tins-cans-packets",
    url: "https://www.aldi.co.uk/products/food-cupboard/tins-cans-packets/k/1588161416978053012",
    categoryPath: ["Food Cupboard", "Tins, Cans & Packets"],
    enabled: true,
  },
  {
    key: "cupboard-sauces-oils-dressings",
    url: "https://www.aldi.co.uk/products/food-cupboard/sauces-oils-dressings/k/1588161416978053010",
    categoryPath: ["Food Cupboard", "Sauces, Oils & Dressings"],
    enabled: true,
  },
  {
    key: "cupboard-herbs-spices",
    url: "https://www.aldi.co.uk/products/food-cupboard/herbs-spices/k/1588161416978053007",
    categoryPath: ["Food Cupboard", "Herbs & Spices"],
    enabled: true,
  },
  {
    key: "cupboard-cereals-snack-bars",
    url: "https://www.aldi.co.uk/products/food-cupboard/cereals-snack-bars/k/1588161416978053002",
    categoryPath: ["Food Cupboard", "Cereals & Snack Bars"],
    enabled: true,
  },
  {
    key: "cupboard-sugar-home-baking",
    url: "https://www.aldi.co.uk/products/food-cupboard/sugar-home-baking/k/1588161416978053011",
    categoryPath: ["Food Cupboard", "Sugar & Home Baking"],
    enabled: true,
  },
  {
    key: "cupboard-seeds-nuts-dried-fruits",
    url: "https://www.aldi.co.uk/products/food-cupboard/seeds-nuts-dried-fruits/k/1588161416978053009",
    categoryPath: ["Food Cupboard", "Seeds, Nuts & Dried Fruits"],
    enabled: true,
  },
  {
    key: "cupboard-jams-spreads-syrups",
    url: "https://www.aldi.co.uk/products/food-cupboard/jams-spreads-syrups/k/1588161416978053006",
    categoryPath: ["Food Cupboard", "Jams, Spreads & Syrups"],
    enabled: true,
  },
  {
    key: "cupboard-biscuits-crackers",
    url: "https://www.aldi.co.uk/products/food-cupboard/biscuits-crackers/k/1588161416978053001",
    categoryPath: ["Food Cupboard", "Biscuits & Crackers"],
    enabled: true,
  },
  {
    key: "cupboard-crisps-snacks",
    url: "https://www.aldi.co.uk/products/food-cupboard/crisps-snacks/k/1588161416978053004",
    categoryPath: ["Food Cupboard", "Crisps & Snacks"],
    enabled: true,
  },
  {
    key: "cupboard-chocolate-sweets",
    url: "https://www.aldi.co.uk/products/food-cupboard/chocolate-sweets/k/1588161416978053003",
    categoryPath: ["Food Cupboard", "Chocolate & Sweets"],
    enabled: true,
  },
  {
    key: "cupboard-desserts",
    url: "https://www.aldi.co.uk/products/food-cupboard/desserts/k/1588161416978053005",
    categoryPath: ["Food Cupboard", "Desserts"],
    enabled: true,
  },

  // --- Chilled Food -------------------------------------------------------
  {
    key: "chilled-milk",
    url: "https://www.aldi.co.uk/products/chilled-food/milk/k/1588161416978051001",
    categoryPath: ["Chilled Food", "Milk"],
    enabled: true,
  },
  {
    key: "chilled-dairy",
    url: "https://www.aldi.co.uk/products/chilled-food/dairy/k/1588161416978051002",
    categoryPath: ["Chilled Food", "Dairy"],
    enabled: true,
  },
  {
    key: "chilled-eggs",
    url: "https://www.aldi.co.uk/products/chilled-food/eggs/k/1588161416978051003",
    categoryPath: ["Chilled Food", "Eggs"],
    enabled: true,
  },
  {
    key: "chilled-cheese",
    url: "https://www.aldi.co.uk/products/chilled-food/cheese/k/1588161416978051004",
    categoryPath: ["Chilled Food", "Cheese"],
    enabled: true,
  },
  {
    key: "chilled-yogurts",
    url: "https://www.aldi.co.uk/products/chilled-food/yogurts/k/1588161416978051005",
    categoryPath: ["Chilled Food", "Yogurts"],
    enabled: true,
  },
  {
    key: "chilled-meats",
    url: "https://www.aldi.co.uk/products/chilled-food/chilled-meats/k/1588161416978051011",
    categoryPath: ["Chilled Food", "Chilled Meats"],
    enabled: true,
  },
  {
    key: "chilled-meat-substitutes",
    url: "https://www.aldi.co.uk/products/chilled-food/meat-substitutes/k/1588161421695436",
    categoryPath: ["Chilled Food", "Meat Substitutes"],
    enabled: true,
  },
  {
    key: "chilled-ready-meals",
    url: "https://www.aldi.co.uk/products/chilled-food/ready-meals/k/1588161416978051007",
    categoryPath: ["Chilled Food", "Ready Meals"],
    enabled: true,
  },
  {
    key: "chilled-pizza-pasta-garlic-bread",
    url: "https://www.aldi.co.uk/products/chilled-food/pizza-pasta-garlic-bread/k/1588161416978051008",
    categoryPath: ["Chilled Food", "Pizza, Pasta & Garlic Bread"],
    enabled: true,
  },
  {
    key: "chilled-sides-starters",
    url: "https://www.aldi.co.uk/products/chilled-food/sides-starters/k/1588161416978051009",
    categoryPath: ["Chilled Food", "Sides & Starters"],
    enabled: true,
  },
  {
    key: "chilled-soups",
    url: "https://www.aldi.co.uk/products/chilled-food/soups/k/1588161416978051010",
    categoryPath: ["Chilled Food", "Soups"],
    enabled: true,
  },
  {
    key: "chilled-desserts",
    url: "https://www.aldi.co.uk/products/chilled-food/chilled-desserts/k/1588161416978051006",
    categoryPath: ["Chilled Food", "Chilled Desserts"],
    enabled: true,
  },
  {
    key: "chilled-party-food-pies-salads",
    url: "https://www.aldi.co.uk/products/chilled-food/party-food-pies-salads/k/1588161416978051012",
    categoryPath: ["Chilled Food", "Party Food, Pies & Salads"],
    enabled: true,
  },
  {
    key: "chilled-food-to-go",
    url: "https://www.aldi.co.uk/products/chilled-food/food-to-go/k/1588161416978051013",
    categoryPath: ["Chilled Food", "Food To Go"],
    enabled: true,
  },

  // --- Bakery -------------------------------------------------------------
  {
    key: "bakery-bread",
    url: "https://www.aldi.co.uk/products/bakery/bread/k/1588161416978049001",
    categoryPath: ["Bakery", "Bread"],
    enabled: true,
  },
  {
    key: "bakery-bread-rolls",
    url: "https://www.aldi.co.uk/products/bakery/bread-rolls/k/1588161416978049002",
    categoryPath: ["Bakery", "Bread Rolls"],
    enabled: true,
  },
  {
    key: "bakery-wraps-naans-pittas-thins",
    url: "https://www.aldi.co.uk/products/bakery/wraps-naans-pittas-thins/k/1588161416978049007",
    categoryPath: ["Bakery", "Wraps, Naans, Pittas & Thins"],
    enabled: true,
  },
  {
    key: "bakery-bagels",
    url: "https://www.aldi.co.uk/products/bakery/bagels/k/1588161416978049008",
    categoryPath: ["Bakery", "Bagels"],
    enabled: true,
  },
  {
    key: "bakery-breakfast-pastries",
    url: "https://www.aldi.co.uk/products/bakery/breakfast-pastries/k/1588161416978049005",
    categoryPath: ["Bakery", "Breakfast Pastries"],
    enabled: true,
  },
  {
    key: "bakery-scones-teacakes",
    url: "https://www.aldi.co.uk/products/bakery/scones-teacakes/k/1588161416978049006",
    categoryPath: ["Bakery", "Scones & Teacakes"],
    enabled: true,
  },
  {
    key: "bakery-cakes",
    url: "https://www.aldi.co.uk/products/bakery/cakes/k/1588161416978049003",
    categoryPath: ["Bakery", "Cakes"],
    enabled: true,
  },
  {
    key: "bakery-sweet-treats",
    url: "https://www.aldi.co.uk/products/bakery/sweet-treats/k/1588161416978049004",
    categoryPath: ["Bakery", "Sweet Treats"],
    enabled: true,
  },

  // --- Frozen Food --------------------------------------------------------
  {
    key: "frozen-vegetables-sides",
    url: "https://www.aldi.co.uk/products/frozen-food/vegetables-sides/k/1588161416978056004",
    categoryPath: ["Frozen Food", "Vegetables & Sides"],
    enabled: true,
  },
  {
    key: "frozen-meat-poultry",
    url: "https://www.aldi.co.uk/products/frozen-food/meat-poultry/k/1588161416978056001",
    categoryPath: ["Frozen Food", "Meat & Poultry"],
    enabled: true,
  },
  {
    key: "frozen-fish-seafood",
    url: "https://www.aldi.co.uk/products/frozen-food/fish-seafood/k/1588161416978056002",
    categoryPath: ["Frozen Food", "Fish & Seafood"],
    enabled: true,
  },
  {
    key: "frozen-chips-potato",
    url: "https://www.aldi.co.uk/products/frozen-food/chips-potato/k/1588161416978056003",
    categoryPath: ["Frozen Food", "Chips & Potato"],
    enabled: true,
  },
  {
    key: "frozen-ready-meals",
    url: "https://www.aldi.co.uk/products/frozen-food/ready-meals/k/1588161416978056005",
    categoryPath: ["Frozen Food", "Ready Meals"],
    enabled: true,
  },
  {
    key: "frozen-pizzas-garlic-bread",
    url: "https://www.aldi.co.uk/products/frozen-food/pizzas-garlic-bread/k/1588161416978056006",
    categoryPath: ["Frozen Food", "Pizzas & Garlic Bread"],
    enabled: true,
  },
  {
    key: "frozen-vegetarian-food",
    url: "https://www.aldi.co.uk/products/frozen-food/frozen-vegetarian-food/k/1588161421695435",
    categoryPath: ["Frozen Food", "Frozen Vegetarian Food"],
    enabled: true,
  },
  {
    key: "frozen-fruit-smoothies",
    url: "https://www.aldi.co.uk/products/frozen-food/fruit-smoothies/k/1588161416978056008",
    categoryPath: ["Frozen Food", "Fruit & Smoothies"],
    enabled: true,
  },
  {
    key: "frozen-party-food-snacks-pies",
    url: "https://www.aldi.co.uk/products/frozen-food/party-food-snacks-pies/k/1588161416978056007",
    categoryPath: ["Frozen Food", "Party Food, Snacks & Pies"],
    enabled: true,
  },
  {
    key: "frozen-ice-cream-desserts",
    url: "https://www.aldi.co.uk/products/frozen-food/ice-cream-desserts/k/1588161416978056009",
    categoryPath: ["Frozen Food", "Ice Cream & Desserts"],
    enabled: true,
  },

  // --- Vegetarian & Plant Based (PRD lists Vegetarian as a meal preference) -
  {
    key: "plant-based-chilled-vegetarian",
    url: "https://www.aldi.co.uk/products/vegetarian-plant-based/chilled-vegetarian/k/1588161421881163002",
    categoryPath: ["Vegetarian & Plant Based", "Chilled Vegetarian"],
    enabled: true,
  },
  {
    key: "plant-based-chilled-vegan",
    url: "https://www.aldi.co.uk/products/vegetarian-plant-based/chilled-vegan/k/1588161421881163004",
    categoryPath: ["Vegetarian & Plant Based", "Chilled Vegan"],
    enabled: true,
  },
  {
    key: "plant-based-frozen-vegetarian",
    url: "https://www.aldi.co.uk/products/vegetarian-plant-based/frozen-vegetarian/k/1588161421881163003",
    categoryPath: ["Vegetarian & Plant Based", "Frozen Vegetarian"],
    enabled: true,
  },
  {
    key: "plant-based-drinks",
    url: "https://www.aldi.co.uk/products/vegetarian-plant-based/plant-based-drinks/k/1588161421881163001",
    categoryPath: ["Vegetarian & Plant Based", "Plant Based Drinks"],
    enabled: true,
  },

  // --- Drinks: part of a real basket, not of a meal plan -------------------
  {
    key: "drinks-tea",
    url: "https://www.aldi.co.uk/products/drinks/tea/k/1588161416978054001",
    categoryPath: ["Drinks", "Tea"],
    enabled: false,
  },
  {
    key: "drinks-coffee",
    url: "https://www.aldi.co.uk/products/drinks/coffee/k/1588161416978054002",
    categoryPath: ["Drinks", "Coffee"],
    enabled: false,
  },
  {
    key: "drinks-soft-drinks-juices",
    url: "https://www.aldi.co.uk/products/drinks/soft-drinks-juices/k/1588161416978054004",
    categoryPath: ["Drinks", "Soft Drinks & Juices"],
    enabled: false,
  },
  {
    key: "drinks-water",
    url: "https://www.aldi.co.uk/products/drinks/water/k/1588161416978054005",
    categoryPath: ["Drinks", "Water"],
    enabled: false,
  },
];
