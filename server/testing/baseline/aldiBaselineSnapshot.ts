/**
 * GENERATED FILE — do not edit by hand.
 *
 * Recorded by `npm run baseline:record` from the fixture Aldi catalogue in
 * `server/testing/planningFixtures.ts`. This is the Phase 0 regression oracle
 * for the multi-retailer migration: it is what "Aldi behaviour is preserved"
 * actually means, expressed as data.
 *
 * A diff in this file is a change in planning behaviour. There is no other
 * reading of it.
 */

import type { BaselineRecord } from "./baselineCapture";

export const ALDI_BASELINE: BaselineRecord = {
  "engineVersion": "1.0.0",
  "scenarios": [
    {
      "key": "standard-seed-0",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 2995,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £29.95 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-porridge-0nbgdge",
            "title": "Creamy Corn Flakes porridge",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 2,
            "cookMinutes": 6,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt"
            ],
            "steps": [
              "Warm the British Semi Skimmed Milk in a pan over a low heat.",
              "Stir in the Corn Flakes and cook for five minutes until thick, adding a pinch of salt.",
              "Top with chopped Gala Apples and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 2995,
          "actualPercent": 43,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "standard-seed-1",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 4184,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £41.84 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0trcpr4",
                "title": "Greek Style Natural Yogurt and Blueberries bowl",
                "servings": 2,
                "estimatedCostPence": 92
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-tuna-pasta-salad-0v8k9yf",
                "title": "Tuna Chunks In Brine Spaghetti salad",
                "servings": 2,
                "estimatedCostPence": 79
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-baked-fish-potatoes-0ieup0i",
                "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 178
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-0wiqton",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 125
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0ppbmew",
                "title": "Mature Cheddar Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 132
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0a64rtv",
                "title": "Roast Chicken Breast Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 191
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-0a8y0vs",
                "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 86
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-vegetable-soup-1yzolka",
                "title": "Mixed Peppers soup with Wholemeal Medium Bread",
                "servings": 2,
                "estimatedCostPence": 70
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0dme0vo",
                "title": "Chicken Thigh Fillets with Basmati Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 161
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0trcpr4",
                "title": "Greek Style Natural Yogurt and Blueberries bowl",
                "servings": 2,
                "estimatedCostPence": 92
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-tuna-pasta-salad-0v8k9yf",
                "title": "Tuna Chunks In Brine Spaghetti salad",
                "servings": 2,
                "estimatedCostPence": 79
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-baked-fish-potatoes-0ieup0i",
                "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 178
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-0wiqton",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 125
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0ppbmew",
                "title": "Mature Cheddar Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 132
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0a64rtv",
                "title": "Roast Chicken Breast Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 191
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-0a8y0vs",
                "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 86
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-vegetable-soup-1yzolka",
                "title": "Mixed Peppers soup with Wholemeal Medium Bread",
                "servings": 2,
                "estimatedCostPence": 70
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0dme0vo",
                "title": "Chicken Thigh Fillets with Basmati Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 161
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0trcpr4",
                "title": "Greek Style Natural Yogurt and Blueberries bowl",
                "servings": 2,
                "estimatedCostPence": 92
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-tuna-pasta-salad-0v8k9yf",
                "title": "Tuna Chunks In Brine Spaghetti salad",
                "servings": 2,
                "estimatedCostPence": 79
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-baked-fish-potatoes-0ieup0i",
                "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 178
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-overnight-oats-0a8y0vs",
            "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Stir the Corn Flakes into the Greek Style Natural Yogurt in a covered container.",
              "Chill overnight so the oats soften.",
              "Top with chopped Blueberries before serving."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-yogurt",
              "p-berries"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "quantity": "20% of 200g",
                "estimatedCostPence": 36,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0trcpr4",
            "title": "Greek Style Natural Yogurt and Blueberries bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Blueberries and pile it on top.",
              "Finish with a scattering of Scottish Porridge Oats."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-berries",
              "p-porridge-oats"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "quantity": "25% of 200g",
                "estimatedCostPence": 45,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "10% of 1kg",
                "estimatedCostPence": 15,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-scrambled-eggs-on-toast-0wiqton",
            "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 7,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Beat the Free Range Large Eggs with a pinch of salt and pepper.",
              "Cook gently in an oiled pan, stirring, until just set.",
              "Toast the Soft White Medium Bread and pile the eggs on top.",
              "Grate over a little Mature Cheddar Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-cheddar"
            ],
            "ingredients": [
              {
                "productId": "p-eggs",
                "name": "Free Range Large Eggs",
                "quantity": "35% of 12 pack",
                "estimatedCostPence": 77,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "25% of 800g",
                "estimatedCostPence": 20,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "quantity": "10% of 400g",
                "estimatedCostPence": 28,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-vegetable-soup-1yzolka",
            "title": "Mixed Peppers soup with Wholemeal Medium Bread",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "stock cubes"
            ],
            "steps": [
              "Chop the Mixed Peppers and soften in a little oil.",
              "Cover with stock, simmer until tender, then stir in the Baby Spinach.",
              "Blend or mash to the texture you like and season.",
              "Serve with the Wholemeal Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-peppers",
              "p-wholemeal-bread",
              "p-spinach"
            ],
            "ingredients": [
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "30% of 3 pack",
                "estimatedCostPence": 45,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-wholemeal-bread",
                "name": "Wholemeal Medium Bread",
                "quantity": "20% of 800g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-spinach",
                "name": "Baby Spinach",
                "quantity": "10% of 240g",
                "estimatedCostPence": 9,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-tuna-pasta-salad-0v8k9yf",
            "title": "Tuna Chunks In Brine Spaghetti salad",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 12,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Boil the Spaghetti in salted water until just tender, then cool under the tap.",
              "Flake in the Tuna Chunks In Brine and add the chopped Brown Onions.",
              "Loosen with the Olive Oil and season well."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-spaghetti",
              "p-tuna",
              "p-onions",
              "p-olive-oil"
            ],
            "ingredients": [
              {
                "productId": "p-spaghetti",
                "name": "Spaghetti",
                "quantity": "20% of 500g",
                "estimatedCostPence": 15,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-tuna",
                "name": "Tuna Chunks In Brine",
                "quantity": "25% of 145g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "13% of 1kg",
                "estimatedCostPence": 12,
                "packages": 0.13,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "6% of 500ml",
                "estimatedCostPence": 20,
                "packages": 0.06,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0ppbmew",
            "title": "Mature Cheddar Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Olive Oil.",
              "Add the sliced Mature Cheddar Cheese and the Baby Spinach.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-cheddar",
              "p-spinach",
              "p-olive-oil"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "quantity": "20% of 400g",
                "estimatedCostPence": 56,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-spinach",
                "name": "Baby Spinach",
                "quantity": "20% of 240g",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "8% of 500ml",
                "estimatedCostPence": 26,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-0dme0vo",
            "title": "Chicken Thigh Fillets with Basmati Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Basmati Rice according to the pack.",
              "Season the Chicken Thigh Fillets and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Olive Oil and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-basmati-rice",
              "p-onions",
              "p-olive-oil"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "30% of 600g",
                "estimatedCostPence": 90,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "7% of 500ml",
                "estimatedCostPence": 23,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-baked-fish-potatoes-0ieup0i",
            "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 35,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Cut the Maris Piper Potatoes into wedges, toss in oil and salt, and roast until golden.",
              "Add the Scottish Salmon Fillets to the tray for the last fifteen minutes.",
              "Steam or roast the Brown Onions alongside and season everything well."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-salmon",
              "p-potatoes",
              "p-onions"
            ],
            "ingredients": [
              {
                "productId": "p-salmon",
                "name": "Scottish Salmon Fillets",
                "quantity": "30% of 240g",
                "estimatedCostPence": 129,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "23% of 2kg",
                "estimatedCostPence": 34,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 15,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0a64rtv",
            "title": "Roast Chicken Breast Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Brown Onions and spread over a roasting tray.",
              "Sit the Chicken Breast Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-breast",
              "p-potatoes",
              "p-onions"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-breast",
                "name": "Chicken Breast Fillets",
                "quantity": "35% of 650g",
                "estimatedCostPence": 136,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-wholemeal-bread",
                "name": "Wholemeal Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-wholemeal-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-eggs",
                "name": "Free Range Large Eggs",
                "brand": null,
                "packageSize": "12 pack",
                "quantity": 1,
                "unitPricePence": 219,
                "totalPricePence": 219,
                "productUrl": "https://www.aldi.co.uk/product/p-eggs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "brand": null,
                "packageSize": "400g",
                "quantity": 1,
                "unitPricePence": 279,
                "totalPricePence": 279,
                "productUrl": "https://www.aldi.co.uk/product/p-cheddar",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 179,
                "totalPricePence": 179,
                "productUrl": "https://www.aldi.co.uk/product/p-basmati-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-spaghetti",
                "name": "Spaghetti",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 75,
                "totalPricePence": 75,
                "productUrl": "https://www.aldi.co.uk/product/p-spaghetti",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-tuna",
                "name": "Tuna Chunks In Brine",
                "brand": null,
                "packageSize": "145g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-tuna",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-spinach",
                "name": "Baby Spinach",
                "brand": null,
                "packageSize": "240g",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-spinach",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "brand": null,
                "packageSize": "200g",
                "quantity": 2,
                "unitPricePence": 179,
                "totalPricePence": 358,
                "productUrl": "https://www.aldi.co.uk/product/p-berries",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 2,
                "unitPricePence": 89,
                "totalPricePence": 178,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-breast",
                "name": "Chicken Breast Fillets",
                "brand": null,
                "packageSize": "650g",
                "quantity": 1,
                "unitPricePence": 389,
                "totalPricePence": 389,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-breast",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 2,
                "unitPricePence": 149,
                "totalPricePence": 298,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-salmon",
                "name": "Scottish Salmon Fillets",
                "brand": null,
                "packageSize": "240g",
                "quantity": 1,
                "unitPricePence": 429,
                "totalPricePence": 429,
                "productUrl": "https://www.aldi.co.uk/product/p-salmon",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 20,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 4184,
          "actualPercent": 60,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "standard-seed-7",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 4184,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £41.84 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0trcpr4",
                "title": "Greek Style Natural Yogurt and Blueberries bowl",
                "servings": 2,
                "estimatedCostPence": 92
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-tuna-pasta-salad-0v8k9yf",
                "title": "Tuna Chunks In Brine Spaghetti salad",
                "servings": 2,
                "estimatedCostPence": 79
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-baked-fish-potatoes-0ieup0i",
                "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 178
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-0wiqton",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 125
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0ppbmew",
                "title": "Mature Cheddar Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 132
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0a64rtv",
                "title": "Roast Chicken Breast Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 191
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-0a8y0vs",
                "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 86
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-vegetable-soup-1yzolka",
                "title": "Mixed Peppers soup with Wholemeal Medium Bread",
                "servings": 2,
                "estimatedCostPence": 70
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0dme0vo",
                "title": "Chicken Thigh Fillets with Basmati Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 161
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0trcpr4",
                "title": "Greek Style Natural Yogurt and Blueberries bowl",
                "servings": 2,
                "estimatedCostPence": 92
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-tuna-pasta-salad-0v8k9yf",
                "title": "Tuna Chunks In Brine Spaghetti salad",
                "servings": 2,
                "estimatedCostPence": 79
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-baked-fish-potatoes-0ieup0i",
                "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 178
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-0wiqton",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 125
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0ppbmew",
                "title": "Mature Cheddar Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 132
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0a64rtv",
                "title": "Roast Chicken Breast Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 191
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-0a8y0vs",
                "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 86
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-vegetable-soup-1yzolka",
                "title": "Mixed Peppers soup with Wholemeal Medium Bread",
                "servings": 2,
                "estimatedCostPence": 70
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0dme0vo",
                "title": "Chicken Thigh Fillets with Basmati Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 161
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0trcpr4",
                "title": "Greek Style Natural Yogurt and Blueberries bowl",
                "servings": 2,
                "estimatedCostPence": 92
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-tuna-pasta-salad-0v8k9yf",
                "title": "Tuna Chunks In Brine Spaghetti salad",
                "servings": 2,
                "estimatedCostPence": 79
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-baked-fish-potatoes-0ieup0i",
                "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 178
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-overnight-oats-0a8y0vs",
            "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Stir the Corn Flakes into the Greek Style Natural Yogurt in a covered container.",
              "Chill overnight so the oats soften.",
              "Top with chopped Blueberries before serving."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-yogurt",
              "p-berries"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "quantity": "20% of 200g",
                "estimatedCostPence": 36,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0trcpr4",
            "title": "Greek Style Natural Yogurt and Blueberries bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Blueberries and pile it on top.",
              "Finish with a scattering of Scottish Porridge Oats."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-berries",
              "p-porridge-oats"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "quantity": "25% of 200g",
                "estimatedCostPence": 45,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "10% of 1kg",
                "estimatedCostPence": 15,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-scrambled-eggs-on-toast-0wiqton",
            "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 7,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Beat the Free Range Large Eggs with a pinch of salt and pepper.",
              "Cook gently in an oiled pan, stirring, until just set.",
              "Toast the Soft White Medium Bread and pile the eggs on top.",
              "Grate over a little Mature Cheddar Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-cheddar"
            ],
            "ingredients": [
              {
                "productId": "p-eggs",
                "name": "Free Range Large Eggs",
                "quantity": "35% of 12 pack",
                "estimatedCostPence": 77,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "25% of 800g",
                "estimatedCostPence": 20,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "quantity": "10% of 400g",
                "estimatedCostPence": 28,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-vegetable-soup-1yzolka",
            "title": "Mixed Peppers soup with Wholemeal Medium Bread",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "stock cubes"
            ],
            "steps": [
              "Chop the Mixed Peppers and soften in a little oil.",
              "Cover with stock, simmer until tender, then stir in the Baby Spinach.",
              "Blend or mash to the texture you like and season.",
              "Serve with the Wholemeal Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-peppers",
              "p-wholemeal-bread",
              "p-spinach"
            ],
            "ingredients": [
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "30% of 3 pack",
                "estimatedCostPence": 45,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-wholemeal-bread",
                "name": "Wholemeal Medium Bread",
                "quantity": "20% of 800g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-spinach",
                "name": "Baby Spinach",
                "quantity": "10% of 240g",
                "estimatedCostPence": 9,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-tuna-pasta-salad-0v8k9yf",
            "title": "Tuna Chunks In Brine Spaghetti salad",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 12,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Boil the Spaghetti in salted water until just tender, then cool under the tap.",
              "Flake in the Tuna Chunks In Brine and add the chopped Brown Onions.",
              "Loosen with the Olive Oil and season well."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-spaghetti",
              "p-tuna",
              "p-onions",
              "p-olive-oil"
            ],
            "ingredients": [
              {
                "productId": "p-spaghetti",
                "name": "Spaghetti",
                "quantity": "20% of 500g",
                "estimatedCostPence": 15,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-tuna",
                "name": "Tuna Chunks In Brine",
                "quantity": "25% of 145g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "13% of 1kg",
                "estimatedCostPence": 12,
                "packages": 0.13,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "6% of 500ml",
                "estimatedCostPence": 20,
                "packages": 0.06,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0ppbmew",
            "title": "Mature Cheddar Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Olive Oil.",
              "Add the sliced Mature Cheddar Cheese and the Baby Spinach.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-cheddar",
              "p-spinach",
              "p-olive-oil"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "quantity": "20% of 400g",
                "estimatedCostPence": 56,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-spinach",
                "name": "Baby Spinach",
                "quantity": "20% of 240g",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "8% of 500ml",
                "estimatedCostPence": 26,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-0dme0vo",
            "title": "Chicken Thigh Fillets with Basmati Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Basmati Rice according to the pack.",
              "Season the Chicken Thigh Fillets and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Olive Oil and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-basmati-rice",
              "p-onions",
              "p-olive-oil"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "30% of 600g",
                "estimatedCostPence": 90,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "7% of 500ml",
                "estimatedCostPence": 23,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-baked-fish-potatoes-0ieup0i",
            "title": "Baked Scottish Salmon Fillets with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 35,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Cut the Maris Piper Potatoes into wedges, toss in oil and salt, and roast until golden.",
              "Add the Scottish Salmon Fillets to the tray for the last fifteen minutes.",
              "Steam or roast the Brown Onions alongside and season everything well."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-salmon",
              "p-potatoes",
              "p-onions"
            ],
            "ingredients": [
              {
                "productId": "p-salmon",
                "name": "Scottish Salmon Fillets",
                "quantity": "30% of 240g",
                "estimatedCostPence": 129,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "23% of 2kg",
                "estimatedCostPence": 34,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 15,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0a64rtv",
            "title": "Roast Chicken Breast Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Brown Onions and spread over a roasting tray.",
              "Sit the Chicken Breast Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-breast",
              "p-potatoes",
              "p-onions"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-breast",
                "name": "Chicken Breast Fillets",
                "quantity": "35% of 650g",
                "estimatedCostPence": 136,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-wholemeal-bread",
                "name": "Wholemeal Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-wholemeal-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-eggs",
                "name": "Free Range Large Eggs",
                "brand": null,
                "packageSize": "12 pack",
                "quantity": 1,
                "unitPricePence": 219,
                "totalPricePence": 219,
                "productUrl": "https://www.aldi.co.uk/product/p-eggs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "brand": null,
                "packageSize": "400g",
                "quantity": 1,
                "unitPricePence": 279,
                "totalPricePence": 279,
                "productUrl": "https://www.aldi.co.uk/product/p-cheddar",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 179,
                "totalPricePence": 179,
                "productUrl": "https://www.aldi.co.uk/product/p-basmati-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-spaghetti",
                "name": "Spaghetti",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 75,
                "totalPricePence": 75,
                "productUrl": "https://www.aldi.co.uk/product/p-spaghetti",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-tuna",
                "name": "Tuna Chunks In Brine",
                "brand": null,
                "packageSize": "145g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-tuna",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-spinach",
                "name": "Baby Spinach",
                "brand": null,
                "packageSize": "240g",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-spinach",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "brand": null,
                "packageSize": "200g",
                "quantity": 2,
                "unitPricePence": 179,
                "totalPricePence": 358,
                "productUrl": "https://www.aldi.co.uk/product/p-berries",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 2,
                "unitPricePence": 89,
                "totalPricePence": 178,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-breast",
                "name": "Chicken Breast Fillets",
                "brand": null,
                "packageSize": "650g",
                "quantity": 1,
                "unitPricePence": 389,
                "totalPricePence": 389,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-breast",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 2,
                "unitPricePence": 149,
                "totalPricePence": 298,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-salmon",
                "name": "Scottish Salmon Fillets",
                "brand": null,
                "packageSize": "240g",
                "quantity": 1,
                "unitPricePence": 429,
                "totalPricePence": 429,
                "productUrl": "https://www.aldi.co.uk/product/p-salmon",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 20,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 4184,
          "actualPercent": 60,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "dinner-only-seed-0",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 1300,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £13.00 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-bolognese-1erh2ho",
                "title": "British Turkey Mince bolognese with Fusilli Pasta",
                "servings": 2,
                "estimatedCostPence": 101
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-bolognese-1erh2ho",
                "title": "British Turkey Mince bolognese with Fusilli Pasta",
                "servings": 2,
                "estimatedCostPence": 101
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-pasta-bake-1l1cxgz",
            "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 35,
            "appliances": [
              "oven",
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Boil the Fusilli Pasta until just short of tender and drain.",
              "Soften the chopped Mixed Peppers, then stir in the Chopped Tomatoes and the pasta.",
              "Tip into a dish, cover with the grated Mozzarella Cheese and bake until bubbling."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-fusilli",
              "p-mozzarella",
              "p-chopped-tomatoes",
              "p-peppers"
            ],
            "ingredients": [
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "23% of 500g",
                "estimatedCostPence": 17,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "17% of 125g",
                "estimatedCostPence": 18,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "25% of 400g",
                "estimatedCostPence": 11,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "17% of 3 pack",
                "estimatedCostPence": 25,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-bolognese-1erh2ho",
            "title": "British Turkey Mince bolognese with Fusilli Pasta",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 35,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Brown the British Turkey Mince in a little oil, breaking it up as it cooks.",
              "Pour in the Chopped Tomatoes, season and simmer for half an hour.",
              "Boil the Fusilli Pasta until just tender and serve the sauce over the top."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-fusilli",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "20% of 500g",
                "estimatedCostPence": 15,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "25% of 400g",
                "estimatedCostPence": 11,
                "packages": 0.25,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 75,
                "totalPricePence": 150,
                "productUrl": "https://www.aldi.co.uk/product/p-fusilli",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 249,
                "totalPricePence": 249,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 8,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1300,
          "actualPercent": 19,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "dinner-only-seed-1",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 1599,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £15.99 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-10su7mv",
                "title": "Mature Cheddar Cheese and Chopped Tomatoes Spaghetti bake",
                "servings": 2,
                "estimatedCostPence": 154
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0ctsx97",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 160
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0cr35qw",
                "title": "Pork Sausages with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 116
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-10su7mv",
                "title": "Mature Cheddar Cheese and Chopped Tomatoes Spaghetti bake",
                "servings": 2,
                "estimatedCostPence": 154
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0ctsx97",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 160
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0cr35qw",
                "title": "Pork Sausages with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 116
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-10su7mv",
                "title": "Mature Cheddar Cheese and Chopped Tomatoes Spaghetti bake",
                "servings": 2,
                "estimatedCostPence": 154
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-sausage-mash-0cr35qw",
            "title": "Pork Sausages with mashed Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Boil the Maris Piper Potatoes until soft, then mash with the British Semi Skimmed Milk and season.",
              "Fry or grill the Pork Sausages until browned and cooked through.",
              "Cook the Brown Onions until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-pork-sausages",
              "p-potatoes",
              "p-onions",
              "p-milk"
            ],
            "ingredients": [
              {
                "productId": "p-pork-sausages",
                "name": "Pork Sausages",
                "quantity": "30% of 454g",
                "estimatedCostPence": 57,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 15,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "5% of 2 pints",
                "estimatedCostPence": 7,
                "packages": 0.05,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-pasta-bake-10su7mv",
            "title": "Mature Cheddar Cheese and Chopped Tomatoes Spaghetti bake",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 35,
            "appliances": [
              "oven",
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Boil the Spaghetti until just short of tender and drain.",
              "Soften the chopped Chopped Tomatoes, then stir in the Olive Oil and the pasta.",
              "Tip into a dish, cover with the grated Mature Cheddar Cheese and bake until bubbling."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-spaghetti",
              "p-cheddar",
              "p-olive-oil",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-spaghetti",
                "name": "Spaghetti",
                "quantity": "23% of 500g",
                "estimatedCostPence": 17,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "quantity": "17% of 400g",
                "estimatedCostPence": 47,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "25% of 500ml",
                "estimatedCostPence": 82,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0ctsx97",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Brown Onions and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-onions"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "brand": null,
                "packageSize": "400g",
                "quantity": 1,
                "unitPricePence": 279,
                "totalPricePence": 279,
                "productUrl": "https://www.aldi.co.uk/product/p-cheddar",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-spaghetti",
                "name": "Spaghetti",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 75,
                "totalPricePence": 75,
                "productUrl": "https://www.aldi.co.uk/product/p-spaghetti",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-pork-sausages",
                "name": "Pork Sausages",
                "brand": null,
                "packageSize": "454g",
                "quantity": 1,
                "unitPricePence": 189,
                "totalPricePence": 189,
                "productUrl": "https://www.aldi.co.uk/product/p-pork-sausages",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 9,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1599,
          "actualPercent": 23,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "every-meal-type",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas",
          "p-hummus",
          "p-crackers",
          "p-crisps"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 20000,
        "estimatedTotalPence": 10158,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 8.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £101.58 against a target of about £160.00 (80% of your £200.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 8,
                "estimatedCostPence": 250
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 8,
                "estimatedCostPence": 325
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 8,
                "estimatedCostPence": 453
              },
              {
                "mealType": "snack",
                "recipeId": "snack-fruit-and-yogurt-096bwrv",
                "title": "Bananas with Greek Style Natural Yogurt",
                "servings": 8,
                "estimatedCostPence": 148
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 8,
                "estimatedCostPence": 263
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 8,
                "estimatedCostPence": 371
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 8,
                "estimatedCostPence": 476
              },
              {
                "mealType": "snack",
                "recipeId": "snack-vegetables-and-dip-15bfpsp",
                "title": "Brown Onions sticks with Red Lentils",
                "servings": 8,
                "estimatedCostPence": 174
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 8,
                "estimatedCostPence": 306
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-omelette-0f7szbd",
                "title": "Free Range Large Eggs omelette",
                "servings": 8,
                "estimatedCostPence": 449
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 8,
                "estimatedCostPence": 604
              },
              {
                "mealType": "snack",
                "recipeId": "snack-fruit-and-yogurt-11zjbep",
                "title": "Blueberries with Greek Style Natural Yogurt",
                "servings": 8,
                "estimatedCostPence": 220
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 8,
                "estimatedCostPence": 250
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 8,
                "estimatedCostPence": 325
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 8,
                "estimatedCostPence": 453
              },
              {
                "mealType": "snack",
                "recipeId": "snack-fruit-and-yogurt-096bwrv",
                "title": "Bananas with Greek Style Natural Yogurt",
                "servings": 8,
                "estimatedCostPence": 148
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 8,
                "estimatedCostPence": 263
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 8,
                "estimatedCostPence": 371
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 8,
                "estimatedCostPence": 476
              },
              {
                "mealType": "snack",
                "recipeId": "snack-vegetables-and-dip-15bfpsp",
                "title": "Brown Onions sticks with Red Lentils",
                "servings": 8,
                "estimatedCostPence": 174
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 8,
                "estimatedCostPence": 306
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-omelette-0f7szbd",
                "title": "Free Range Large Eggs omelette",
                "servings": 8,
                "estimatedCostPence": 449
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 8,
                "estimatedCostPence": 604
              },
              {
                "mealType": "snack",
                "recipeId": "snack-fruit-and-yogurt-11zjbep",
                "title": "Blueberries with Greek Style Natural Yogurt",
                "servings": 8,
                "estimatedCostPence": 220
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 8,
                "estimatedCostPence": 250
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 8,
                "estimatedCostPence": 325
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 8,
                "estimatedCostPence": 453
              },
              {
                "mealType": "snack",
                "recipeId": "snack-fruit-and-yogurt-096bwrv",
                "title": "Bananas with Greek Style Natural Yogurt",
                "servings": 8,
                "estimatedCostPence": 148
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1rimeq1",
            "title": "Corn Flakes with cold milk",
            "mealType": "breakfast",
            "servings": 8,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Corn Flakes between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "48% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.48,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "80% of 2 pints",
                "estimatedCostPence": 116,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "60% of 6 pack",
                "estimatedCostPence": 77,
                "packages": 0.6,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 8,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "48% of 1kg",
                "estimatedCostPence": 70,
                "packages": 0.48,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "80% of 2 pints",
                "estimatedCostPence": 116,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "60% of 6 pack",
                "estimatedCostPence": 77,
                "packages": 0.6,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 8,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "1 × 500g",
                "estimatedCostPence": 129,
                "packages": 1,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "1 × 6 pack",
                "estimatedCostPence": 129,
                "packages": 1,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "40% of 500g",
                "estimatedCostPence": 48,
                "packages": 0.4,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 8,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "1 × 500g",
                "estimatedCostPence": 129,
                "packages": 1,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "1 × 3 pack",
                "estimatedCostPence": 149,
                "packages": 1,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "60% of 800g",
                "estimatedCostPence": 47,
                "packages": 0.6,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 8,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "1.2 × 800g",
                "estimatedCostPence": 95,
                "packages": 1.2,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "1 × 500g",
                "estimatedCostPence": 249,
                "packages": 1,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "60% of 400g",
                "estimatedCostPence": 27,
                "packages": 0.6,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-omelette-0f7szbd",
            "title": "Free Range Large Eggs omelette",
            "mealType": "lunch",
            "servings": 8,
            "prepMinutes": 5,
            "cookMinutes": 8,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Beat the Free Range Large Eggs with salt and pepper.",
              "Soften the chopped Chopped Tomatoes in an oiled pan.",
              "Pour in the eggs, scatter over the Mozzarella Cheese and cook until just set, then fold."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-mozzarella",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-eggs",
                "name": "Free Range Large Eggs",
                "quantity": "1.6 × 12 pack",
                "estimatedCostPence": 350,
                "packages": 1.6,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "60% of 125g",
                "estimatedCostPence": 63,
                "packages": 0.6,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "80% of 400g",
                "estimatedCostPence": 36,
                "packages": 0.8,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 8,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "1.2 × 500g",
                "estimatedCostPence": 299,
                "packages": 1.2,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "70% of 1kg",
                "estimatedCostPence": 69,
                "packages": 0.7,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "80% of 1kg",
                "estimatedCostPence": 71,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 8,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "1.2 × 400g",
                "estimatedCostPence": 54,
                "packages": 1.2,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "70% of 1kg",
                "estimatedCostPence": 69,
                "packages": 0.7,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "80% of 500ml",
                "estimatedCostPence": 263,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "70% of 500g",
                "estimatedCostPence": 90,
                "packages": 0.7,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 8,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "1.4 × 600g",
                "estimatedCostPence": 419,
                "packages": 1.4,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "1 × 2kg",
                "estimatedCostPence": 149,
                "packages": 1,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "80% of 400g",
                "estimatedCostPence": 36,
                "packages": 0.8,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "snack-fruit-and-yogurt-096bwrv",
            "title": "Bananas with Greek Style Natural Yogurt",
            "mealType": "snack",
            "servings": 8,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Chop the Bananas.",
              "Serve with a spoonful of Greek Style Natural Yogurt."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-bananas",
              "p-yogurt"
            ],
            "ingredients": [
              {
                "productId": "p-bananas",
                "name": "Bananas",
                "quantity": "80% of 5 pack",
                "estimatedCostPence": 71,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "60% of 500g",
                "estimatedCostPence": 77,
                "packages": 0.6,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "snack-vegetables-and-dip-15bfpsp",
            "title": "Brown Onions sticks with Red Lentils",
            "mealType": "snack",
            "servings": 8,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Cut the Brown Onions into sticks.",
              "Serve with the Red Lentils to share."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-onions",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "80% of 1kg",
                "estimatedCostPence": 71,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "80% of 500g",
                "estimatedCostPence": 103,
                "packages": 0.8,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "snack-fruit-and-yogurt-11zjbep",
            "title": "Blueberries with Greek Style Natural Yogurt",
            "mealType": "snack",
            "servings": 8,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Chop the Blueberries.",
              "Serve with a spoonful of Greek Style Natural Yogurt."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-berries",
              "p-yogurt"
            ],
            "ingredients": [
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "quantity": "80% of 200g",
                "estimatedCostPence": 143,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "60% of 500g",
                "estimatedCostPence": 77,
                "packages": 0.6,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 5,
                "unitPricePence": 79,
                "totalPricePence": 395,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 4,
                "unitPricePence": 145,
                "totalPricePence": 580,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-eggs",
                "name": "Free Range Large Eggs",
                "brand": null,
                "packageSize": "12 pack",
                "quantity": 4,
                "unitPricePence": 219,
                "totalPricePence": 876,
                "productUrl": "https://www.aldi.co.uk/product/p-eggs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 5,
                "unitPricePence": 129,
                "totalPricePence": 645,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 2,
                "unitPricePence": 105,
                "totalPricePence": 210,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 8,
                "unitPricePence": 45,
                "totalPricePence": 360,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 3,
                "unitPricePence": 119,
                "totalPricePence": 357,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 4,
                "unitPricePence": 99,
                "totalPricePence": 396,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 2,
                "unitPricePence": 329,
                "totalPricePence": 658,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 6,
                "unitPricePence": 129,
                "totalPricePence": 774,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-bananas",
                "name": "Bananas",
                "brand": null,
                "packageSize": "5 pack",
                "quantity": 3,
                "unitPricePence": 89,
                "totalPricePence": 267,
                "productUrl": "https://www.aldi.co.uk/product/p-bananas",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "brand": null,
                "packageSize": "200g",
                "quantity": 2,
                "unitPricePence": 179,
                "totalPricePence": 358,
                "productUrl": "https://www.aldi.co.uk/product/p-berries",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 6,
                "unitPricePence": 249,
                "totalPricePence": 1494,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 4,
                "unitPricePence": 89,
                "totalPricePence": 356,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 3,
                "unitPricePence": 299,
                "totalPricePence": 897,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 5,
                "unitPricePence": 129,
                "totalPricePence": 645,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 2,
                "unitPricePence": 149,
                "totalPricePence": 298,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 3,
                "unitPricePence": 149,
                "totalPricePence": 447,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 19,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 16000,
          "actualPence": 10158,
          "actualPercent": 51,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "no-cook",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 2690,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £26.90 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-18jle2t",
                "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1t3q25g",
                "title": "Chicken Thigh Fillets sandwich",
                "servings": 2,
                "estimatedCostPence": 106
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-05elb0b",
                "title": "Overnight Scottish Porridge Oats with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 80
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-ploughmans-plate-0nlvt3h",
                "title": "Mozzarella Cheese ploughman's plate",
                "servings": 2,
                "estimatedCostPence": 85
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-18jle2t",
                "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1t3q25g",
                "title": "Chicken Thigh Fillets sandwich",
                "servings": 2,
                "estimatedCostPence": 106
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-05elb0b",
                "title": "Overnight Scottish Porridge Oats with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 80
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-ploughmans-plate-0nlvt3h",
                "title": "Mozzarella Cheese ploughman's plate",
                "servings": 2,
                "estimatedCostPence": 85
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-overnight-oats-18jle2t",
                "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1t3q25g",
                "title": "Chicken Thigh Fillets sandwich",
                "servings": 2,
                "estimatedCostPence": 106
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-overnight-oats-18jle2t",
            "title": "Overnight Corn Flakes with Greek Style Natural Yogurt",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Stir the Corn Flakes into the Greek Style Natural Yogurt in a covered container.",
              "Chill overnight so the oats soften.",
              "Top with chopped Gala Apples before serving."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-yogurt",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-overnight-oats-05elb0b",
            "title": "Overnight Scottish Porridge Oats with Greek Style Natural Yogurt",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Stir the Scottish Porridge Oats into the Greek Style Natural Yogurt in a covered container.",
              "Chill overnight so the oats soften.",
              "Top with chopped Gala Apples before serving."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-yogurt",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "15% of 1kg",
                "estimatedCostPence": 22,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1t3q25g",
            "title": "Chicken Thigh Fillets sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the Chicken Thigh Fillets and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-chicken-thighs",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "25% of 600g",
                "estimatedCostPence": 75,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-ploughmans-plate-0nlvt3h",
            "title": "Mozzarella Cheese ploughman's plate",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Cut the Mozzarella Cheese into thick wedges.",
              "Arrange on plates with the Soft White Medium Bread, the Chopped Tomatoes and the Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-mozzarella",
              "p-white-bread",
              "p-chopped-tomatoes",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "25% of 125g",
                "estimatedCostPence": 26,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-cold-plate-0vvwmdn",
            "title": "British Turkey Mince plate with Soft White Medium Bread",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 15,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Slice the British Turkey Mince and the Chopped Tomatoes.",
              "Arrange on plates with the Mixed Salad Leaves and season.",
              "Serve with the Soft White Medium Bread alongside."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-white-bread",
              "p-chopped-tomatoes",
              "p-mixed-salad"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "40% of 500g",
                "estimatedCostPence": 100,
                "packages": 0.4,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "35% of 800g",
                "estimatedCostPence": 28,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 4,
                "unitPricePence": 79,
                "totalPricePence": 316,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 4,
                "unitPricePence": 45,
                "totalPricePence": 180,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 3,
                "unitPricePence": 249,
                "totalPricePence": 747,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 2,
                "unitPricePence": 79,
                "totalPricePence": 158,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 11,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 2690,
          "actualPercent": 38,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "milk-allergy",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "You declared an allergy, but no product in this plan has retailer-verified allergen data. Products whose inferred allergens conflicted with your allergies were removed, but inference can miss allergens. Do not rely on this plan for allergy safety; check the packaging of every item."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 9000,
        "estimatedTotalPence": 2995,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "You declared an allergy, but no product in this plan has retailer-verified allergen data. Products whose inferred allergens conflicted with your allergies were removed, but inference can miss allergens. Do not rely on this plan for allergy safety; check the packaging of every item.",
          "This plan comes to £29.95 against a target of about £72.00 (80% of your £90.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 2,
                "estimatedCostPence": 62
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 2,
                "estimatedCostPence": 62
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 2,
                "estimatedCostPence": 62
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1rimeq1",
            "title": "Corn Flakes with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Corn Flakes between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "12% of 500g",
                "estimatedCostPence": 14,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 7200,
          "actualPence": 2995,
          "actualPercent": 33,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "dislikes",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 2,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 2802,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £28.02 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 2,
                "estimatedCostPence": 62
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-19jz6vs",
                "title": "British Turkey Mince and Long Grain Rice bowl",
                "servings": 2,
                "estimatedCostPence": 86
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-1b0c559",
                "title": "Roast British Turkey Mince tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 133
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 2,
                "estimatedCostPence": 62
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-19jz6vs",
                "title": "British Turkey Mince and Long Grain Rice bowl",
                "servings": 2,
                "estimatedCostPence": 86
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-1b0c559",
                "title": "Roast British Turkey Mince tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 133
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1rimeq1",
                "title": "Corn Flakes with cold milk",
                "servings": 2,
                "estimatedCostPence": 62
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1rimeq1",
            "title": "Corn Flakes with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Corn Flakes between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "12% of 500g",
                "estimatedCostPence": 14,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-chicken-rice-bowl-19jz6vs",
            "title": "British Turkey Mince and Long Grain Rice bowl",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 20,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack and keep warm.",
              "Fry the sliced British Turkey Mince in oil with your spices until cooked through.",
              "Add the Chopped Tomatoes and cook until just tender."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-long-grain-rice",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-1b0c559",
            "title": "Roast British Turkey Mince tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the British Turkey Mince on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "35% of 500g",
                "estimatedCostPence": 87,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 3,
                "unitPricePence": 45,
                "totalPricePence": 135,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 2802,
          "actualPercent": 40,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "budget-target-50",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 2995,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-porridge-0nbgdge",
            "title": "Creamy Corn Flakes porridge",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 2,
            "cookMinutes": 6,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt"
            ],
            "steps": [
              "Warm the British Semi Skimmed Milk in a pan over a low heat.",
              "Stir in the Corn Flakes and cook for five minutes until thick, adding a pinch of salt.",
              "Top with chopped Gala Apples and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 50,
          "targetPence": 3500,
          "actualPence": 2995,
          "actualPercent": 43,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "budget-target-65",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 2995,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £29.95 against a target of about £45.50 (65% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-porridge-0nbgdge",
            "title": "Creamy Corn Flakes porridge",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 2,
            "cookMinutes": 6,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt"
            ],
            "steps": [
              "Warm the British Semi Skimmed Milk in a pan over a low heat.",
              "Stir in the Corn Flakes and cook for five minutes until thick, adding a pinch of salt.",
              "Top with chopped Gala Apples and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 65,
          "targetPence": 4550,
          "actualPence": 2995,
          "actualPercent": 43,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "budget-target-80",
      "selection": {
        "productIds": [
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-basmati-rice",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 2995,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £29.95 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-porridge-0nbgdge",
            "title": "Creamy Corn Flakes porridge",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 2,
            "cookMinutes": 6,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt"
            ],
            "steps": [
              "Warm the British Semi Skimmed Milk in a pan over a low heat.",
              "Stir in the Corn Flakes and cook for five minutes until thick, adding a pinch of salt.",
              "Top with chopped Gala Apples and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 2995,
          "actualPercent": 43,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "must-have-single",
      "selection": {
        "productIds": [
          "p-basmati-rice",
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-chicken-breast",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-passata",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 1200,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £12.00 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1iknxpf",
                "title": "Red Lentils dhal with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 69
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-0mydgfc",
                "title": "Mozzarella Cheese and Chopped Tomatoes Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 125
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-00uuv3q",
                "title": "British Turkey Mince with Basmati Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 126
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1iknxpf",
                "title": "Red Lentils dhal with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 69
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-0mydgfc",
                "title": "Mozzarella Cheese and Chopped Tomatoes Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 125
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-00uuv3q",
                "title": "British Turkey Mince with Basmati Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 126
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1iknxpf",
                "title": "Red Lentils dhal with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 69
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-lentil-dhal-1iknxpf",
            "title": "Red Lentils dhal with Basmati Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 35,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Toast your spices in oil, then add the Red Lentils and the chopped Chopped Tomatoes.",
              "Season well and serve with the Basmati Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-basmati-rice",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-pasta-bake-0mydgfc",
            "title": "Mozzarella Cheese and Chopped Tomatoes Fusilli Pasta bake",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 35,
            "appliances": [
              "oven",
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Boil the Fusilli Pasta until just short of tender and drain.",
              "Soften the chopped Chopped Tomatoes, then stir in the Olive Oil and the pasta.",
              "Tip into a dish, cover with the grated Mozzarella Cheese and bake until bubbling."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-fusilli",
              "p-mozzarella",
              "p-olive-oil",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "23% of 500g",
                "estimatedCostPence": 17,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "17% of 125g",
                "estimatedCostPence": 18,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "25% of 500ml",
                "estimatedCostPence": 82,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-00uuv3q",
            "title": "British Turkey Mince with Basmati Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Basmati Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-basmati-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 179,
                "totalPricePence": 179,
                "productUrl": "https://www.aldi.co.uk/product/p-basmati-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 75,
                "totalPricePence": 75,
                "productUrl": "https://www.aldi.co.uk/product/p-fusilli",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 249,
                "totalPricePence": 249,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 8,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1200,
          "actualPercent": 17,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [
          {
            "productId": "p-basmati-rice",
            "productName": "Basmati Rice",
            "usedIn": [
              {
                "day": 1,
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1iknxpf"
              },
              {
                "day": 3,
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-00uuv3q"
              },
              {
                "day": 4,
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1iknxpf"
              },
              {
                "day": 6,
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-00uuv3q"
              },
              {
                "day": 7,
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1iknxpf"
              }
            ]
          }
        ],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "must-have-three",
      "selection": {
        "productIds": [
          "p-chicken-breast",
          "p-basmati-rice",
          "p-passata",
          "p-turkey-mince",
          "p-chicken-thighs",
          "p-beef-mince",
          "p-pork-sausages",
          "p-back-bacon",
          "p-salmon",
          "p-red-lentils",
          "p-baked-beans",
          "p-chopped-tomatoes",
          "p-chickpeas",
          "p-fusilli",
          "p-spaghetti",
          "p-couscous",
          "p-egg-noodles",
          "p-long-grain-rice",
          "p-cornflakes",
          "p-tuna",
          "p-porridge-oats",
          "p-onions",
          "p-peppers",
          "p-carrots",
          "p-broccoli",
          "p-mixed-salad",
          "p-spinach",
          "p-potatoes",
          "p-mozzarella",
          "p-yogurt",
          "p-milk",
          "p-eggs",
          "p-cheddar",
          "p-olive-oil",
          "p-soy-sauce",
          "p-curry-sauce",
          "p-white-bread",
          "p-wholemeal-bread",
          "p-tortilla-wraps",
          "p-apples",
          "p-berries",
          "p-bananas"
        ],
        "productsConsidered": 45,
        "excludedForAllergies": 0,
        "excludedForSafety": 0,
        "excludedForDislikes": 0,
        "usesInferredProducts": true,
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ]
      },
      "response": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 12000,
        "estimatedTotalPence": 2186,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £21.86 against a target of about £96.00 (80% of your £120.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5",
                "title": "Chicken Breast Fillets and Basmati Rice bowl",
                "servings": 2,
                "estimatedCostPence": 138
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70",
                "title": "Chopped Tomatoes and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 142
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-17gmlmk",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-19h2p9o",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 74
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-bean-chilli-0jklghn",
                "title": "Red Lentils chilli with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 86
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5",
                "title": "Chicken Breast Fillets and Basmati Rice bowl",
                "servings": 2,
                "estimatedCostPence": 138
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70",
                "title": "Chopped Tomatoes and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 142
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-17gmlmk",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-19h2p9o",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 74
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-bean-chilli-0jklghn",
                "title": "Red Lentils chilli with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 86
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5",
                "title": "Chicken Breast Fillets and Basmati Rice bowl",
                "servings": 2,
                "estimatedCostPence": 138
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70",
                "title": "Chopped Tomatoes and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 142
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "lunch-chicken-rice-bowl-0zuk7s5",
            "title": "Chicken Breast Fillets and Basmati Rice bowl",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 20,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Basmati Rice according to the pack and keep warm.",
              "Fry the sliced Chicken Breast Fillets in oil with your spices until cooked through.",
              "Add the Chopped Tomatoes and cook until just tender.",
              "Spoon over the rice and finish with the Tomato Passata."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-chicken-breast",
              "p-chopped-tomatoes",
              "p-passata"
            ],
            "ingredients": [
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-chicken-breast",
                "name": "Chicken Breast Fillets",
                "quantity": "25% of 650g",
                "estimatedCostPence": 97,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "quantity": "7% of 500g",
                "estimatedCostPence": 4,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-17gmlmk",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Tomato Passata.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-passata"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "quantity": "8% of 500g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-stir-fry-noodles-0kx9h70",
            "title": "Chopped Tomatoes and Basmati Rice stir fry",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 12,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Prepare the Basmati Rice according to the pack and set aside.",
              "Fry the Chicken Breast Fillets over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Tomato Passata and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-chopped-tomatoes",
              "p-chicken-breast",
              "p-passata"
            ],
            "ingredients": [
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 36,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "25% of 400g",
                "estimatedCostPence": 11,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chicken-breast",
                "name": "Chicken Breast Fillets",
                "quantity": "23% of 650g",
                "estimatedCostPence": 89,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "quantity": "10% of 500g",
                "estimatedCostPence": 6,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-pasta-bake-19h2p9o",
            "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 35,
            "appliances": [
              "oven",
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Boil the Fusilli Pasta until just short of tender and drain.",
              "Soften the chopped Mixed Peppers, then stir in the Tomato Passata and the pasta.",
              "Tip into a dish, cover with the grated Mozzarella Cheese and bake until bubbling."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-fusilli",
              "p-mozzarella",
              "p-passata",
              "p-peppers"
            ],
            "ingredients": [
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "23% of 500g",
                "estimatedCostPence": 17,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "17% of 125g",
                "estimatedCostPence": 18,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "quantity": "25% of 500g",
                "estimatedCostPence": 14,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "17% of 3 pack",
                "estimatedCostPence": 25,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-bean-chilli-0jklghn",
            "title": "Red Lentils chilli with Basmati Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Chopped Tomatoes in oil with your chilli spices.",
              "Add the Red Lentils and the Tomato Passata and simmer until thick.",
              "Season and serve over the cooked Basmati Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-basmati-rice",
              "p-chopped-tomatoes",
              "p-passata"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "28% of 500g",
                "estimatedCostPence": 36,
                "packages": 0.28,
                "imageUrl": null
              },
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "quantity": "20% of 500g",
                "estimatedCostPence": 11,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 2,
                "unitPricePence": 179,
                "totalPricePence": 358,
                "productUrl": "https://www.aldi.co.uk/product/p-basmati-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 75,
                "totalPricePence": 75,
                "productUrl": "https://www.aldi.co.uk/product/p-fusilli",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 55,
                "totalPricePence": 110,
                "productUrl": "https://www.aldi.co.uk/product/p-passata",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-chicken-breast",
                "name": "Chicken Breast Fillets",
                "brand": null,
                "packageSize": "650g",
                "quantity": 2,
                "unitPricePence": 389,
                "totalPricePence": 778,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-breast",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 11,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 9600,
          "actualPence": 2186,
          "actualPercent": 18,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [
          {
            "productId": "p-basmati-rice",
            "productName": "Basmati Rice",
            "usedIn": [
              {
                "day": 1,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 1,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 3,
                "mealType": "dinner",
                "recipeId": "dinner-bean-chilli-0jklghn"
              },
              {
                "day": 4,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 4,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 6,
                "mealType": "dinner",
                "recipeId": "dinner-bean-chilli-0jklghn"
              },
              {
                "day": 7,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 7,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              }
            ]
          },
          {
            "productId": "p-chicken-breast",
            "productName": "Chicken Breast Fillets",
            "usedIn": [
              {
                "day": 1,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 1,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 4,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 4,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 7,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 7,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              }
            ]
          },
          {
            "productId": "p-passata",
            "productName": "Tomato Passata",
            "usedIn": [
              {
                "day": 1,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 1,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 2,
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-17gmlmk"
              },
              {
                "day": 2,
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-19h2p9o"
              },
              {
                "day": 3,
                "mealType": "dinner",
                "recipeId": "dinner-bean-chilli-0jklghn"
              },
              {
                "day": 4,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 4,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 5,
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-17gmlmk"
              },
              {
                "day": 5,
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-19h2p9o"
              },
              {
                "day": 6,
                "mealType": "dinner",
                "recipeId": "dinner-bean-chilli-0jklghn"
              },
              {
                "day": 7,
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-0zuk7s5"
              },
              {
                "day": 7,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              }
            ]
          }
        ],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    }
  ],
  "replacements": [
    {
      "key": "replace-standard-day-3-dinner",
      "day": 3,
      "mealType": "dinner",
      "before": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 2995,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £29.95 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-porridge-0nbgdge",
            "title": "Creamy Corn Flakes porridge",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 2,
            "cookMinutes": 6,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt"
            ],
            "steps": [
              "Warm the British Semi Skimmed Milk in a pan over a low heat.",
              "Stir in the Corn Flakes and cook for five minutes until thick, adding a pinch of salt.",
              "Top with chopped Gala Apples and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 2995,
          "actualPercent": 43,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      },
      "after": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 3074,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0ejxkix",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 76
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-roast-chicken-tray-0qxeld3",
                "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 151
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-cereal-bowl-1w9r9xj",
                "title": "Scottish Porridge Oats with cold milk",
                "servings": 2,
                "estimatedCostPence": 65
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-0bjtbv7",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-1d9x2pl",
                "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
                "servings": 2,
                "estimatedCostPence": 113
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-cereal-bowl-1w9r9xj",
            "title": "Scottish Porridge Oats with cold milk",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 3,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Divide the Scottish Porridge Oats between bowls.",
              "Pour over the British Semi Skimmed Milk.",
              "Scatter over sliced Gala Apples."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-porridge-oats",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "quantity": "12% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.12,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "15% of 6 pack",
                "estimatedCostPence": 19,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-porridge-0nbgdge",
            "title": "Creamy Corn Flakes porridge",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 2,
            "cookMinutes": 6,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt"
            ],
            "steps": [
              "Warm the British Semi Skimmed Milk in a pan over a low heat.",
              "Stir in the Corn Flakes and cook for five minutes until thick, adding a pinch of salt.",
              "Top with chopped Gala Apples and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
              "p-apples"
            ],
            "ingredients": [
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "15% of 500g",
                "estimatedCostPence": 18,
                "packages": 0.15,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "20% of 6 pack",
                "estimatedCostPence": 26,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "breakfast-yogurt-fruit-bowl-0ejxkix",
            "title": "Greek Style Natural Yogurt and Gala Apples bowl",
            "mealType": "breakfast",
            "servings": 2,
            "prepMinutes": 5,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [],
            "steps": [
              "Spoon the Greek Style Natural Yogurt into bowls.",
              "Chop the Gala Apples and pile it on top.",
              "Finish with a scattering of Corn Flakes."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
              "p-cornflakes"
            ],
            "ingredients": [
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "quantity": "10% of 500g",
                "estimatedCostPence": 12,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-0bjtbv7",
            "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "pepper"
            ],
            "steps": [
              "Spread the Plain Tortilla Wraps with a little Chopped Tomatoes.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "quantity": "30% of 8 pack",
                "estimatedCostPence": 32,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "20% of 125g",
                "estimatedCostPence": 21,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "8% of 400g",
                "estimatedCostPence": 4,
                "packages": 0.08,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-lentil-soup-1j3b211",
            "title": "Red Lentils and Mixed Peppers soup",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Soften the chopped Mixed Peppers in oil with a spoonful of spices.",
              "Add the Red Lentils and enough stock to cover, then simmer until soft.",
              "Season to taste and serve with the Soft White Medium Bread."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-peppers",
              "p-white-bread"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "25% of 500g",
                "estimatedCostPence": 32,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "25% of 3 pack",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "15% of 800g",
                "estimatedCostPence": 12,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-1gljp02",
            "title": "British Turkey Mince sandwich",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 8,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Lay out slices of Soft White Medium Bread.",
              "Add the British Turkey Mince and season.",
              "Top with the Chopped Tomatoes, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-white-bread",
              "p-turkey-mince",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "25% of 500g",
                "estimatedCostPence": 62,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "15% of 400g",
                "estimatedCostPence": 7,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-1d9x2pl",
            "title": "British Turkey Mince with Long Grain Rice and Brown Onions",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 25,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Cook the Long Grain Rice according to the pack.",
              "Season the British Turkey Mince and fry in oil until cooked through.",
              "Add the Brown Onions and cook until tender.",
              "Stir through the Chopped Tomatoes and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-long-grain-rice",
              "p-onions",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "20% of 1kg",
                "estimatedCostPence": 18,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "7% of 400g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-roast-chicken-tray-0qxeld3",
            "title": "Roast Chicken Thigh Fillets tray with Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 50,
            "appliances": [
              "oven"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Halve the Maris Piper Potatoes and the Chopped Tomatoes and spread over a roasting tray.",
              "Sit the Chicken Thigh Fillets on top, oil and season generously.",
              "Roast until the chicken is cooked through and the vegetables are golden."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chicken-thighs",
              "p-potatoes",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "35% of 600g",
                "estimatedCostPence": 105,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "quantity": "25% of 2kg",
                "estimatedCostPence": 37,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-cold-plate-0vvwmdn",
            "title": "British Turkey Mince plate with Soft White Medium Bread",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 15,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Slice the British Turkey Mince and the Chopped Tomatoes.",
              "Arrange on plates with the Mixed Salad Leaves and season.",
              "Serve with the Soft White Medium Bread alongside."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-white-bread",
              "p-chopped-tomatoes",
              "p-mixed-salad"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "40% of 500g",
                "estimatedCostPence": 100,
                "packages": 0.4,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "35% of 800g",
                "estimatedCostPence": 28,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-tortilla-wraps",
                "name": "Plain Tortilla Wraps",
                "brand": null,
                "packageSize": "8 pack",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-tortilla-wraps",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 2,
                "unitPricePence": 79,
                "totalPricePence": 158,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "brand": null,
                "packageSize": "2 pints",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-milk",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-yogurt",
                "name": "Greek Style Natural Yogurt",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-yogurt",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-cornflakes",
                "name": "Corn Flakes",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 119,
                "totalPricePence": 119,
                "productUrl": "https://www.aldi.co.uk/product/p-cornflakes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-porridge-oats",
                "name": "Scottish Porridge Oats",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 145,
                "totalPricePence": 145,
                "productUrl": "https://www.aldi.co.uk/product/p-porridge-oats",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 89,
                "totalPricePence": 89,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 1,
                "unitPricePence": 299,
                "totalPricePence": 299,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-thighs",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-apples",
                "name": "Gala Apples",
                "brand": null,
                "packageSize": "6 pack",
                "quantity": 2,
                "unitPricePence": 129,
                "totalPricePence": 258,
                "productUrl": "https://www.aldi.co.uk/product/p-apples",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-potatoes",
                "name": "Maris Piper Potatoes",
                "brand": null,
                "packageSize": "2kg",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-potatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 3074,
          "actualPercent": 44,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    },
    {
      "key": "replace-dinner-only-day-1",
      "day": 1,
      "mealType": "dinner",
      "before": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 1300,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £13.00 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-bolognese-1erh2ho",
                "title": "British Turkey Mince bolognese with Fusilli Pasta",
                "servings": 2,
                "estimatedCostPence": 101
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-bolognese-1erh2ho",
                "title": "British Turkey Mince bolognese with Fusilli Pasta",
                "servings": 2,
                "estimatedCostPence": 101
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-pasta-bake-1l1cxgz",
            "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 35,
            "appliances": [
              "oven",
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Boil the Fusilli Pasta until just short of tender and drain.",
              "Soften the chopped Mixed Peppers, then stir in the Chopped Tomatoes and the pasta.",
              "Tip into a dish, cover with the grated Mozzarella Cheese and bake until bubbling."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-fusilli",
              "p-mozzarella",
              "p-chopped-tomatoes",
              "p-peppers"
            ],
            "ingredients": [
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "23% of 500g",
                "estimatedCostPence": 17,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "17% of 125g",
                "estimatedCostPence": 18,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "25% of 400g",
                "estimatedCostPence": 11,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "17% of 3 pack",
                "estimatedCostPence": 25,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-bolognese-1erh2ho",
            "title": "British Turkey Mince bolognese with Fusilli Pasta",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 35,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Brown the British Turkey Mince in a little oil, breaking it up as it cooks.",
              "Pour in the Chopped Tomatoes, season and simmer for half an hour.",
              "Boil the Fusilli Pasta until just tender and serve the sauce over the top."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-fusilli",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "20% of 500g",
                "estimatedCostPence": 15,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "25% of 400g",
                "estimatedCostPence": 11,
                "packages": 0.25,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 75,
                "totalPricePence": 150,
                "productUrl": "https://www.aldi.co.uk/product/p-fusilli",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 249,
                "totalPricePence": 249,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 8,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1300,
          "actualPercent": 19,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      },
      "after": {
        "planId": "baseline-plan-id",
        "generatedAt": "2026-08-20T00:00:00.000Z",
        "catalogue": {
          "retailerId": "000000000000000000000a1d",
          "retailerSlug": "aldi-uk",
          "retailerName": "Aldi UK",
          "storeId": "000000000000000000005702",
          "storeSlug": "belper-de56-1ar",
          "storeName": "Aldi Belper",
          "crawlRunId": "fixture-crawl-run",
          "catalogueUpdatedAt": "2026-08-18T06:00:00.000Z"
        },
        "currency": "GBP",
        "budgetPence": 7000,
        "estimatedTotalPence": 1383,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-cold-plate-0vvwmdn",
                "title": "British Turkey Mince plate with Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 158
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-bolognese-1erh2ho",
                "title": "British Turkey Mince bolognese with Fusilli Pasta",
                "servings": 2,
                "estimatedCostPence": 101
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-bolognese-1erh2ho",
                "title": "British Turkey Mince bolognese with Fusilli Pasta",
                "servings": 2,
                "estimatedCostPence": 101
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-1of4nli",
                "title": "Chopped Tomatoes curry with Long Grain Rice",
                "servings": 2,
                "estimatedCostPence": 119
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-pasta-bake-1l1cxgz",
                "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
                "servings": 2,
                "estimatedCostPence": 71
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-pasta-bake-1l1cxgz",
            "title": "Mozzarella Cheese and Mixed Peppers Fusilli Pasta bake",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 35,
            "appliances": [
              "oven",
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Boil the Fusilli Pasta until just short of tender and drain.",
              "Soften the chopped Mixed Peppers, then stir in the Chopped Tomatoes and the pasta.",
              "Tip into a dish, cover with the grated Mozzarella Cheese and bake until bubbling."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-fusilli",
              "p-mozzarella",
              "p-chopped-tomatoes",
              "p-peppers"
            ],
            "ingredients": [
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "23% of 500g",
                "estimatedCostPence": 17,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "17% of 125g",
                "estimatedCostPence": 18,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "25% of 400g",
                "estimatedCostPence": 11,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "17% of 3 pack",
                "estimatedCostPence": 25,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-bolognese-1erh2ho",
            "title": "British Turkey Mince bolognese with Fusilli Pasta",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 35,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil",
              "basic herbs and spices"
            ],
            "steps": [
              "Brown the British Turkey Mince in a little oil, breaking it up as it cooks.",
              "Pour in the Chopped Tomatoes, season and simmer for half an hour.",
              "Boil the Fusilli Pasta until just tender and serve the sauce over the top."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-fusilli",
              "p-chopped-tomatoes"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "30% of 500g",
                "estimatedCostPence": 75,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "quantity": "20% of 500g",
                "estimatedCostPence": 15,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "25% of 400g",
                "estimatedCostPence": 11,
                "packages": 0.25,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-1of4nli",
            "title": "Chopped Tomatoes curry with Long Grain Rice",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 12,
            "cookMinutes": 30,
            "appliances": [
              "hob"
            ],
            "pantryItems": [
              "salt",
              "cooking oil",
              "basic herbs and spices",
              "stock cubes"
            ],
            "steps": [
              "Fry your spices in oil for a minute until fragrant.",
              "Add the chopped Chopped Tomatoes and the Red Lentils and coat in the spices.",
              "Pour in the Olive Oil, then simmer until everything is tender.",
              "Serve with the cooked Long Grain Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-long-grain-rice",
              "p-olive-oil",
              "p-red-lentils"
            ],
            "ingredients": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 17,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "quantity": "20% of 500ml",
                "estimatedCostPence": 66,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
                "packages": 0.17,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-cold-plate-0vvwmdn",
            "title": "British Turkey Mince plate with Soft White Medium Bread",
            "mealType": "dinner",
            "servings": 2,
            "prepMinutes": 15,
            "cookMinutes": 0,
            "appliances": [],
            "pantryItems": [
              "salt",
              "pepper"
            ],
            "steps": [
              "Slice the British Turkey Mince and the Chopped Tomatoes.",
              "Arrange on plates with the Mixed Salad Leaves and season.",
              "Serve with the Soft White Medium Bread alongside."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-white-bread",
              "p-chopped-tomatoes",
              "p-mixed-salad"
            ],
            "ingredients": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "40% of 500g",
                "estimatedCostPence": 100,
                "packages": 0.4,
                "imageUrl": null
              },
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "quantity": "35% of 800g",
                "estimatedCostPence": 28,
                "packages": 0.35,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "30% of 400g",
                "estimatedCostPence": 14,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "quantity": "20% of 160g",
                "estimatedCostPence": 16,
                "packages": 0.2,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Bakery",
            "items": [
              {
                "productId": "p-white-bread",
                "name": "Soft White Medium Bread",
                "brand": null,
                "packageSize": "800g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-white-bread",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Chilled Food",
            "items": [
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "brand": null,
                "packageSize": "125g",
                "quantity": 1,
                "unitPricePence": 105,
                "totalPricePence": 105,
                "productUrl": "https://www.aldi.co.uk/product/p-mozzarella",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-fusilli",
                "name": "Fusilli Pasta",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 75,
                "totalPricePence": 75,
                "productUrl": "https://www.aldi.co.uk/product/p-fusilli",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-long-grain-rice",
                "name": "Long Grain Rice",
                "brand": null,
                "packageSize": "1kg",
                "quantity": 1,
                "unitPricePence": 99,
                "totalPricePence": 99,
                "productUrl": "https://www.aldi.co.uk/product/p-long-grain-rice",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-olive-oil",
                "name": "Olive Oil",
                "brand": null,
                "packageSize": "500ml",
                "quantity": 1,
                "unitPricePence": 329,
                "totalPricePence": 329,
                "productUrl": "https://www.aldi.co.uk/product/p-olive-oil",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
                "productUrl": "https://www.aldi.co.uk/product/p-red-lentils",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 249,
                "totalPricePence": 249,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "brand": null,
                "packageSize": "3 pack",
                "quantity": 1,
                "unitPricePence": 149,
                "totalPricePence": 149,
                "productUrl": "https://www.aldi.co.uk/product/p-peppers",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-mixed-salad",
                "name": "Mixed Salad Leaves",
                "brand": null,
                "packageSize": "160g",
                "quantity": 1,
                "unitPricePence": 79,
                "totalPricePence": 79,
                "productUrl": "https://www.aldi.co.uk/product/p-mixed-salad",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 10,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1383,
          "actualPercent": 20,
          "withinPreferredRange": false
        },
        "mustHaveUsage": [],
        "cookingDays": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ]
      }
    }
  ]
};
