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
          "p-basmati-rice",
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
        "estimatedTotalPence": 3104,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £31.04 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
                "quantity": 2,
                "unitPricePence": 299,
                "totalPricePence": 598,
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
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 3104,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 4015,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £40.15 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-041jasb",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 83
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1d7nmrg",
                "title": "Basmati Rice salad with Mixed Peppers",
                "servings": 2,
                "estimatedCostPence": 75
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
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
                "recipeId": "lunch-filled-sandwich-0goxn3p",
                "title": "Beef Mince 5% Fat sandwich",
                "servings": 2,
                "estimatedCostPence": 124
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
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0vfxyt3",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 79
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
                "recipeId": "dinner-stir-fry-noodles-04rks47",
                "title": "Brown Onions and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 132
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-041jasb",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 83
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1d7nmrg",
                "title": "Basmati Rice salad with Mixed Peppers",
                "servings": 2,
                "estimatedCostPence": 75
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
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
                "recipeId": "lunch-filled-sandwich-0goxn3p",
                "title": "Beef Mince 5% Fat sandwich",
                "servings": 2,
                "estimatedCostPence": 124
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
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0vfxyt3",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 79
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
                "recipeId": "dinner-stir-fry-noodles-04rks47",
                "title": "Brown Onions and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 132
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-041jasb",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 83
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1d7nmrg",
                "title": "Basmati Rice salad with Mixed Peppers",
                "servings": 2,
                "estimatedCostPence": 75
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-yogurt-fruit-bowl-0vfxyt3",
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
              "Finish with a scattering of Scottish Porridge Oats."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
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
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
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
            "id": "breakfast-porridge-041jasb",
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
              "Top with chopped Blueberries and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
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
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
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
            "id": "lunch-couscous-salad-1d7nmrg",
            "title": "Basmati Rice salad with Mixed Peppers",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 5,
            "appliances": [
              "kettle"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Cover the Basmati Rice with boiling water and leave to swell, then fork through.",
              "Stir in the chopped Mixed Peppers and a splash of oil.",
              "Crumble over the Mature Cheddar Cheese and season."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-peppers",
              "p-cheddar"
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
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "17% of 3 pack",
                "estimatedCostPence": 25,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "quantity": "7% of 400g",
                "estimatedCostPence": 20,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-0goxn3p",
            "title": "Beef Mince 5% Fat sandwich",
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
              "Lay out slices of Wholemeal Medium Bread.",
              "Add the Beef Mince 5% Fat and season.",
              "Top with the Brown Onions, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-wholemeal-bread",
              "p-beef-mince",
              "p-onions"
            ],
            "ingredients": [
              {
                "productId": "p-wholemeal-bread",
                "name": "Wholemeal Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "quantity": "25% of 500g",
                "estimatedCostPence": 87,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "15% of 1kg",
                "estimatedCostPence": 13,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-stir-fry-noodles-04rks47",
            "title": "Brown Onions and Basmati Rice stir fry",
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
              "Fry the Chicken Thigh Fillets over a high heat until cooked, then lift out.",
              "Stir fry the sliced Brown Onions until just tender.",
              "Return everything to the pan with the Chopped Tomatoes and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-onions",
              "p-chicken-thighs",
              "p-chopped-tomatoes"
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
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "25% of 1kg",
                "estimatedCostPence": 22,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "23% of 600g",
                "estimatedCostPence": 69,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "10% of 400g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-1mzf4ra",
            "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
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
              "Fry or grill the Beef Mince 5% Fat until browned and cooked through.",
              "Cook the Brown Onions until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-beef-mince",
              "p-potatoes",
              "p-onions",
              "p-milk"
            ],
            "ingredients": [
              {
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "quantity": "30% of 500g",
                "estimatedCostPence": 105,
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
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
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
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 349,
                "totalPricePence": 698,
                "productUrl": "https://www.aldi.co.uk/product/p-beef-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "brand": null,
                "packageSize": "200g",
                "quantity": 1,
                "unitPricePence": 179,
                "totalPricePence": 179,
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
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
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
                "quantity": 2,
                "unitPricePence": 149,
                "totalPricePence": 298,
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
          "productsUsed": 19,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 4015,
          "actualPercent": 57,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 4015,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £40.15 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-041jasb",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 83
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1d7nmrg",
                "title": "Basmati Rice salad with Mixed Peppers",
                "servings": 2,
                "estimatedCostPence": 75
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
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
                "recipeId": "lunch-filled-sandwich-0goxn3p",
                "title": "Beef Mince 5% Fat sandwich",
                "servings": 2,
                "estimatedCostPence": 124
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
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0vfxyt3",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 79
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
                "recipeId": "dinner-stir-fry-noodles-04rks47",
                "title": "Brown Onions and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 132
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-041jasb",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 83
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1d7nmrg",
                "title": "Basmati Rice salad with Mixed Peppers",
                "servings": 2,
                "estimatedCostPence": 75
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
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
                "recipeId": "lunch-filled-sandwich-0goxn3p",
                "title": "Beef Mince 5% Fat sandwich",
                "servings": 2,
                "estimatedCostPence": 124
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
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-yogurt-fruit-bowl-0vfxyt3",
                "title": "Greek Style Natural Yogurt and Gala Apples bowl",
                "servings": 2,
                "estimatedCostPence": 79
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
                "recipeId": "dinner-stir-fry-noodles-04rks47",
                "title": "Brown Onions and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 132
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-porridge-041jasb",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 83
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1d7nmrg",
                "title": "Basmati Rice salad with Mixed Peppers",
                "servings": 2,
                "estimatedCostPence": 75
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "breakfast-yogurt-fruit-bowl-0vfxyt3",
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
              "Finish with a scattering of Scottish Porridge Oats."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-yogurt",
              "p-apples",
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
                "productId": "p-apples",
                "name": "Gala Apples",
                "quantity": "25% of 6 pack",
                "estimatedCostPence": 32,
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
            "id": "breakfast-porridge-041jasb",
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
              "Top with chopped Blueberries and serve."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-cornflakes",
              "p-milk",
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
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
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
            "id": "lunch-couscous-salad-1d7nmrg",
            "title": "Basmati Rice salad with Mixed Peppers",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 5,
            "appliances": [
              "kettle"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Cover the Basmati Rice with boiling water and leave to swell, then fork through.",
              "Stir in the chopped Mixed Peppers and a splash of oil.",
              "Crumble over the Mature Cheddar Cheese and season."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-peppers",
              "p-cheddar"
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
                "productId": "p-peppers",
                "name": "Mixed Peppers",
                "quantity": "17% of 3 pack",
                "estimatedCostPence": 25,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-cheddar",
                "name": "Mature Cheddar Cheese",
                "quantity": "7% of 400g",
                "estimatedCostPence": 20,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-filled-sandwich-0goxn3p",
            "title": "Beef Mince 5% Fat sandwich",
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
              "Lay out slices of Wholemeal Medium Bread.",
              "Add the Beef Mince 5% Fat and season.",
              "Top with the Brown Onions, close the sandwich and cut in half."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-wholemeal-bread",
              "p-beef-mince",
              "p-onions"
            ],
            "ingredients": [
              {
                "productId": "p-wholemeal-bread",
                "name": "Wholemeal Medium Bread",
                "quantity": "30% of 800g",
                "estimatedCostPence": 24,
                "packages": 0.3,
                "imageUrl": null
              },
              {
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "quantity": "25% of 500g",
                "estimatedCostPence": 87,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "15% of 1kg",
                "estimatedCostPence": 13,
                "packages": 0.15,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-stir-fry-noodles-04rks47",
            "title": "Brown Onions and Basmati Rice stir fry",
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
              "Fry the Chicken Thigh Fillets over a high heat until cooked, then lift out.",
              "Stir fry the sliced Brown Onions until just tender.",
              "Return everything to the pan with the Chopped Tomatoes and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-onions",
              "p-chicken-thighs",
              "p-chopped-tomatoes"
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
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "25% of 1kg",
                "estimatedCostPence": 22,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "23% of 600g",
                "estimatedCostPence": 69,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "10% of 400g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-1mzf4ra",
            "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
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
              "Fry or grill the Beef Mince 5% Fat until browned and cooked through.",
              "Cook the Brown Onions until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-beef-mince",
              "p-potatoes",
              "p-onions",
              "p-milk"
            ],
            "ingredients": [
              {
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "quantity": "30% of 500g",
                "estimatedCostPence": 105,
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
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
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
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "brand": null,
                "packageSize": "500g",
                "quantity": 2,
                "unitPricePence": 349,
                "totalPricePence": 698,
                "productUrl": "https://www.aldi.co.uk/product/p-beef-mince",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-berries",
                "name": "Blueberries",
                "brand": null,
                "packageSize": "200g",
                "quantity": 1,
                "unitPricePence": 179,
                "totalPricePence": 179,
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
                "quantity": 1,
                "unitPricePence": 129,
                "totalPricePence": 129,
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
                "quantity": 2,
                "unitPricePence": 149,
                "totalPricePence": 298,
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
          "productsUsed": 19,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 4015,
          "actualPercent": 57,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 1355,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £13.55 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
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
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
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
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 7,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1355,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 1922,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £19.22 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
              }
            ]
          },
          {
            "day": 2,
            "meals": [
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
            "day": 3,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-04rks47",
                "title": "Brown Onions and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 132
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
              }
            ]
          },
          {
            "day": 5,
            "meals": [
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
            "day": 6,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-04rks47",
                "title": "Brown Onions and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 132
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-1mzf4ra",
                "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 164
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-stir-fry-noodles-04rks47",
            "title": "Brown Onions and Basmati Rice stir fry",
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
              "Fry the Chicken Thigh Fillets over a high heat until cooked, then lift out.",
              "Stir fry the sliced Brown Onions until just tender.",
              "Return everything to the pan with the Chopped Tomatoes and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-onions",
              "p-chicken-thighs",
              "p-chopped-tomatoes"
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
                "productId": "p-onions",
                "name": "Brown Onions",
                "quantity": "25% of 1kg",
                "estimatedCostPence": 22,
                "packages": 0.25,
                "imageUrl": null
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "23% of 600g",
                "estimatedCostPence": 69,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "10% of 400g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-1mzf4ra",
            "title": "Beef Mince 5% Fat with mashed Maris Piper Potatoes",
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
              "Fry or grill the Beef Mince 5% Fat until browned and cooked through.",
              "Cook the Brown Onions until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-beef-mince",
              "p-potatoes",
              "p-onions",
              "p-milk"
            ],
            "ingredients": [
              {
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "quantity": "30% of 500g",
                "estimatedCostPence": 105,
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
              }
            ]
          },
          {
            "category": "Fresh Food",
            "items": [
              {
                "productId": "p-beef-mince",
                "name": "Beef Mince 5% Fat",
                "brand": null,
                "packageSize": "500g",
                "quantity": 1,
                "unitPricePence": 349,
                "totalPricePence": 349,
                "productUrl": "https://www.aldi.co.uk/product/p-beef-mince",
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
          "productsUsed": 8,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1922,
          "actualPercent": 27,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 10231,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 8.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £102.31 against a target of about £160.00 (80% of your £200.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
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
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 8,
                "estimatedCostPence": 390
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
                "recipeId": "lunch-filled-sandwich-1t3q25g",
                "title": "Chicken Thigh Fillets sandwich",
                "servings": 8,
                "estimatedCostPence": 421
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 8,
                "estimatedCostPence": 508
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
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 8,
                "estimatedCostPence": 390
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
                "recipeId": "lunch-filled-sandwich-1t3q25g",
                "title": "Chicken Thigh Fillets sandwich",
                "servings": 8,
                "estimatedCostPence": 421
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 8,
                "estimatedCostPence": 508
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
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 8,
                "estimatedCostPence": 390
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
            "id": "lunch-filled-sandwich-1t3q25g",
            "title": "Chicken Thigh Fillets sandwich",
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
                "quantity": "1.2 × 800g",
                "estimatedCostPence": 95,
                "packages": 1.2,
                "imageUrl": null
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "quantity": "1 × 600g",
                "estimatedCostPence": 299,
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
            "mealType": "dinner",
            "servings": 8,
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "80% of 500g",
                "estimatedCostPence": 103,
                "packages": 0.8,
                "imageUrl": null
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "1 × 400g",
                "estimatedCostPence": 45,
                "packages": 1,
                "imageUrl": null
              },
              {
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "90% of 500g",
                "estimatedCostPence": 224,
                "packages": 0.9,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "40% of 410g",
                "estimatedCostPence": 18,
                "packages": 0.4,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
            "mealType": "dinner",
            "servings": 8,
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "70% of 400g",
                "estimatedCostPence": 31,
                "packages": 0.7,
                "imageUrl": null
              },
              {
                "productId": "p-milk",
                "name": "British Semi Skimmed Milk",
                "quantity": "20% of 2 pints",
                "estimatedCostPence": 29,
                "packages": 0.2,
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
                "quantity": 5,
                "unitPricePence": 145,
                "totalPricePence": 725,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 2,
                "unitPricePence": 45,
                "totalPricePence": 90,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "brand": null,
                "packageSize": "400g",
                "quantity": 9,
                "unitPricePence": 45,
                "totalPricePence": 405,
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
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "brand": null,
                "packageSize": "500g",
                "quantity": 7,
                "unitPricePence": 129,
                "totalPricePence": 903,
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
                "quantity": 2,
                "unitPricePence": 89,
                "totalPricePence": 178,
                "productUrl": "https://www.aldi.co.uk/product/p-onions",
                "imageUrl": null,
                "alreadyOwned": false
              },
              {
                "productId": "p-chicken-thighs",
                "name": "Chicken Thigh Fillets",
                "brand": null,
                "packageSize": "600g",
                "quantity": 5,
                "unitPricePence": 299,
                "totalPricePence": 1495,
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
                "quantity": 4,
                "unitPricePence": 149,
                "totalPricePence": 596,
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
          "productsUsed": 18,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 16000,
          "actualPence": 10231,
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
          "p-basmati-rice",
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
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
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
                "imageUrl": null,
                "alreadyOwned": false
              },
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
          "productsUsed": 12,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 3104,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "You declared an allergy, but no product in this plan has retailer-verified allergen data. Products whose inferred allergens conflicted with your allergies were removed, but inference can miss allergens. Do not rely on this plan for allergy safety; check the packaging of every item.",
          "This plan comes to £31.04 against a target of about £72.00 (80% of your £90.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
                "quantity": 2,
                "unitPricePence": 299,
                "totalPricePence": 598,
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
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 7200,
          "actualPence": 3104,
          "actualPercent": 34,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 2821,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £28.21 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-1gbrzbb",
                "title": "British Turkey Mince and Red Lentils bowl",
                "servings": 2,
                "estimatedCostPence": 94
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-filled-sandwich-1gljp02",
                "title": "British Turkey Mince sandwich",
                "servings": 2,
                "estimatedCostPence": 93
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-chicken-rice-bowl-1gbrzbb",
                "title": "British Turkey Mince and Red Lentils bowl",
                "servings": 2,
                "estimatedCostPence": 94
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
                "estimatedCostPence": 4,
                "packages": 0.08,
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
            "id": "lunch-chicken-rice-bowl-1gbrzbb",
            "title": "British Turkey Mince and Red Lentils bowl",
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
              "Cook the Red Lentils according to the pack and keep warm.",
              "Fry the sliced British Turkey Mince in oil with your spices until cooked through.",
              "Add the Chopped Tomatoes and cook until just tender.",
              "Spoon over the rice and finish with the Baked Beans In Tomato Sauce."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-turkey-mince",
              "p-chopped-tomatoes",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "17% of 500g",
                "estimatedCostPence": 22,
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
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "7% of 410g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
                "imageUrl": null,
                "alreadyOwned": false
              },
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
          "productsUsed": 15,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 2821,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 3104,
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
                "quantity": 2,
                "unitPricePence": 299,
                "totalPricePence": 598,
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
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 50,
          "targetPence": 3500,
          "actualPence": 3104,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 3104,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £31.04 against a target of about £45.50 (65% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
                "quantity": 2,
                "unitPricePence": 299,
                "totalPricePence": 598,
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
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 65,
          "targetPence": 4550,
          "actualPence": 3104,
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
          "p-basmati-rice",
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
        "estimatedTotalPence": 3104,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £31.04 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
                "quantity": 2,
                "unitPricePence": 299,
                "totalPricePence": 598,
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
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 3104,
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
        "estimatedTotalPence": 1120,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £11.20 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-083teus",
                "title": "Chopped Tomatoes curry with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 75
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-19rdbtc",
                "title": "Chopped Tomatoes and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 109
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0nxl59r",
                "title": "British Turkey Mince with Basmati Rice and Chopped Tomatoes",
                "servings": 2,
                "estimatedCostPence": 117
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-083teus",
                "title": "Chopped Tomatoes curry with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 75
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-19rdbtc",
                "title": "Chopped Tomatoes and Basmati Rice stir fry",
                "servings": 2,
                "estimatedCostPence": 109
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0nxl59r",
                "title": "British Turkey Mince with Basmati Rice and Chopped Tomatoes",
                "servings": 2,
                "estimatedCostPence": 117
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-083teus",
                "title": "Chopped Tomatoes curry with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 75
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-vegetable-curry-083teus",
            "title": "Chopped Tomatoes curry with Basmati Rice",
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
              "Pour in the Baked Beans In Tomato Sauce, then simmer until everything is tender.",
              "Serve with the cooked Basmati Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-basmati-rice",
              "p-baked-beans",
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
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "20% of 410g",
                "estimatedCostPence": 9,
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
            "id": "dinner-stir-fry-noodles-19rdbtc",
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
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-chicken-rice-vegetables-0nxl59r",
            "title": "British Turkey Mince with Basmati Rice and Chopped Tomatoes",
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
              "Add the Chopped Tomatoes and cook until tender.",
              "Stir through the Baked Beans In Tomato Sauce and serve over the rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-basmati-rice",
              "p-chopped-tomatoes",
              "p-baked-beans"
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
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "20% of 400g",
                "estimatedCostPence": 9,
                "packages": 0.2,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "7% of 410g",
                "estimatedCostPence": 3,
                "packages": 0.07,
                "imageUrl": null
              }
            ]
          }
        ],
        "shoppingList": [
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
                "imageUrl": null,
                "alreadyOwned": false
              },
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
                "quantity": 2,
                "unitPricePence": 249,
                "totalPricePence": 498,
                "productUrl": "https://www.aldi.co.uk/product/p-turkey-mince",
                "imageUrl": null,
                "alreadyOwned": false
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 5,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1120,
          "actualPercent": 16,
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
                "recipeId": "dinner-vegetable-curry-083teus"
              },
              {
                "day": 2,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-19rdbtc"
              },
              {
                "day": 3,
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0nxl59r"
              },
              {
                "day": 4,
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-083teus"
              },
              {
                "day": 5,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-19rdbtc"
              },
              {
                "day": 6,
                "mealType": "dinner",
                "recipeId": "dinner-chicken-rice-vegetables-0nxl59r"
              },
              {
                "day": 7,
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-083teus"
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
          "p-basmati-rice",
          "p-chicken-breast",
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
        "estimatedTotalPence": 1629,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £16.29 against a target of about £96.00 (80% of your £120.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1njehbx",
                "title": "Basmati Rice salad with Chopped Tomatoes",
                "servings": 2,
                "estimatedCostPence": 45
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
                "recipeId": "dinner-lentil-dhal-1hes2ut",
                "title": "Red Lentils dhal with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 76
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-omelette-0f7szbd",
                "title": "Free Range Large Eggs omelette",
                "servings": 2,
                "estimatedCostPence": 113
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-02kw0n2",
                "title": "Chopped Tomatoes curry with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 77
              }
            ]
          },
          {
            "day": 4,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1njehbx",
                "title": "Basmati Rice salad with Chopped Tomatoes",
                "servings": 2,
                "estimatedCostPence": 45
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
                "recipeId": "dinner-lentil-dhal-1hes2ut",
                "title": "Red Lentils dhal with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 76
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-omelette-0f7szbd",
                "title": "Free Range Large Eggs omelette",
                "servings": 2,
                "estimatedCostPence": 113
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-02kw0n2",
                "title": "Chopped Tomatoes curry with Basmati Rice",
                "servings": 2,
                "estimatedCostPence": 77
              }
            ]
          },
          {
            "day": 7,
            "meals": [
              {
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1njehbx",
                "title": "Basmati Rice salad with Chopped Tomatoes",
                "servings": 2,
                "estimatedCostPence": 45
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
            "id": "lunch-couscous-salad-1njehbx",
            "title": "Basmati Rice salad with Chopped Tomatoes",
            "mealType": "lunch",
            "servings": 2,
            "prepMinutes": 10,
            "cookMinutes": 5,
            "appliances": [
              "kettle"
            ],
            "pantryItems": [
              "salt",
              "pepper",
              "cooking oil"
            ],
            "steps": [
              "Cover the Basmati Rice with boiling water and leave to swell, then fork through.",
              "Stir in the chopped Chopped Tomatoes and a splash of oil.",
              "Crumble over the Mozzarella Cheese and season."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-basmati-rice",
              "p-chopped-tomatoes",
              "p-mozzarella"
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
                "productId": "p-chopped-tomatoes",
                "name": "Chopped Tomatoes",
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "7% of 125g",
                "estimatedCostPence": 7,
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
            "id": "lunch-omelette-0f7szbd",
            "title": "Free Range Large Eggs omelette",
            "mealType": "lunch",
            "servings": 2,
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
                "quantity": "40% of 12 pack",
                "estimatedCostPence": 88,
                "packages": 0.4,
                "imageUrl": null
              },
              {
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "15% of 125g",
                "estimatedCostPence": 16,
                "packages": 0.15,
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
            "id": "dinner-lentil-dhal-1hes2ut",
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
              "Cover with stock and the Tomato Passata and simmer until thick and soft.",
              "Season well and serve with the Basmati Rice."
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
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "quantity": "13% of 500g",
                "estimatedCostPence": 7,
                "packages": 0.13,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-vegetable-curry-02kw0n2",
            "title": "Chopped Tomatoes curry with Basmati Rice",
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
              "Pour in the Tomato Passata, then simmer until everything is tender.",
              "Serve with the cooked Basmati Rice."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-chopped-tomatoes",
              "p-basmati-rice",
              "p-passata",
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
                "productId": "p-basmati-rice",
                "name": "Basmati Rice",
                "quantity": "17% of 1kg",
                "estimatedCostPence": 30,
                "packages": 0.17,
                "imageUrl": null
              },
              {
                "productId": "p-passata",
                "name": "Tomato Passata",
                "quantity": "20% of 500g",
                "estimatedCostPence": 11,
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
                "quantity": 3,
                "unitPricePence": 45,
                "totalPricePence": 135,
                "productUrl": "https://www.aldi.co.uk/product/p-chopped-tomatoes",
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
                "quantity": 1,
                "unitPricePence": 389,
                "totalPricePence": 389,
                "productUrl": "https://www.aldi.co.uk/product/p-chicken-breast",
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
          "productsUsed": 9,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 9600,
          "actualPence": 1629,
          "actualPercent": 14,
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
                "recipeId": "lunch-couscous-salad-1njehbx"
              },
              {
                "day": 1,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 2,
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1hes2ut"
              },
              {
                "day": 3,
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-02kw0n2"
              },
              {
                "day": 4,
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1njehbx"
              },
              {
                "day": 4,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 5,
                "mealType": "dinner",
                "recipeId": "dinner-lentil-dhal-1hes2ut"
              },
              {
                "day": 6,
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-02kw0n2"
              },
              {
                "day": 7,
                "mealType": "lunch",
                "recipeId": "lunch-couscous-salad-1njehbx"
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
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
              },
              {
                "day": 4,
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0kx9h70"
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
                "recipeId": "dinner-lentil-dhal-1hes2ut"
              },
              {
                "day": 3,
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-02kw0n2"
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
                "recipeId": "dinner-lentil-dhal-1hes2ut"
              },
              {
                "day": 6,
                "mealType": "dinner",
                "recipeId": "dinner-vegetable-curry-02kw0n2"
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
        "estimatedTotalPence": 3104,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £31.04 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
                "quantity": 2,
                "unitPricePence": 299,
                "totalPricePence": 598,
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
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 3104,
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
        "estimatedTotalPence": 2805,
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
            "day": 4,
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
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
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
                "recipeId": "lunch-lentil-soup-1j3b211",
                "title": "Red Lentils and Mixed Peppers soup",
                "servings": 2,
                "estimatedCostPence": 81
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
              {
                "mealType": "breakfast",
                "recipeId": "breakfast-scrambled-eggs-on-toast-06ljrvh",
                "title": "Scrambled Free Range Large Eggs on Soft White Medium Bread",
                "servings": 2,
                "estimatedCostPence": 108
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
                "recipeId": "breakfast-porridge-0nbgdge",
                "title": "Creamy Corn Flakes porridge",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "lunch",
                "recipeId": "lunch-cheese-salad-wrap-1abuga6",
                "title": "Mozzarella Cheese and salad Plain Tortilla Wraps",
                "servings": 2,
                "estimatedCostPence": 73
              },
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
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
            "id": "breakfast-scrambled-eggs-on-toast-06ljrvh",
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
              "Grate over a little Mozzarella Cheese."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-eggs",
              "p-white-bread",
              "p-mozzarella"
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
                "productId": "p-mozzarella",
                "name": "Mozzarella Cheese",
                "quantity": "10% of 125g",
                "estimatedCostPence": 11,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "lunch-cheese-salad-wrap-1abuga6",
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
              "Spread the Plain Tortilla Wraps with a little Baked Beans In Tomato Sauce.",
              "Add the sliced Mozzarella Cheese and the Mixed Salad Leaves.",
              "Roll up tightly and cut on the diagonal."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-tortilla-wraps",
              "p-mozzarella",
              "p-mixed-salad",
              "p-baked-beans"
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "8% of 410g",
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
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
          "productsUsed": 16,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 2805,
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
        "estimatedTotalPence": 1355,
        "budgetStatus": "within-budget",
        "assumptions": [
          "Recipes are scaled for a household of 2.",
          "Prices are the Aldi UK shelf prices recorded at the last catalogue crawl and exclude offers."
        ],
        "warnings": [
          "Aldi does not publish ingredient or allergen data, so allergens for these products were inferred from product names and descriptions. This is not a guarantee — always check the label on the packaging before eating.",
          "This plan comes to £13.55 against a target of about £56.00 (80% of your £70.00 maximum). The Aldi catalogue and the constraints you set did not offer a richer week that still fits every rule. Nothing was added to the basket just to spend more."
        ],
        "days": [
          {
            "day": 1,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          },
          {
            "day": 2,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
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
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
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
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
              }
            ]
          }
        ],
        "productCoverage": {
          "productsConsidered": 45,
          "productsUsed": 7,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1355,
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
        "estimatedTotalPence": 1513,
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
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 3,
            "meals": [
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
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          },
          {
            "day": 5,
            "meals": [
              {
                "mealType": "dinner",
                "recipeId": "dinner-sausage-mash-0vwlyz6",
                "title": "British Turkey Mince with mashed Maris Piper Potatoes",
                "servings": 2,
                "estimatedCostPence": 127
              }
            ]
          },
          {
            "day": 6,
            "meals": [
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
                "mealType": "dinner",
                "recipeId": "dinner-stir-fry-noodles-0aaltk0",
                "title": "Chopped Tomatoes and Red Lentils stir fry",
                "servings": 2,
                "estimatedCostPence": 99
              }
            ]
          }
        ],
        "recipes": [
          {
            "id": "dinner-stir-fry-noodles-0aaltk0",
            "title": "Chopped Tomatoes and Red Lentils stir fry",
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
              "Prepare the Red Lentils according to the pack and set aside.",
              "Fry the British Turkey Mince over a high heat until cooked, then lift out.",
              "Stir fry the sliced Chopped Tomatoes until just tender.",
              "Return everything to the pan with the Baked Beans In Tomato Sauce and toss to coat."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-red-lentils",
              "p-chopped-tomatoes",
              "p-turkey-mince",
              "p-baked-beans"
            ],
            "ingredients": [
              {
                "productId": "p-red-lentils",
                "name": "Red Lentils",
                "quantity": "20% of 500g",
                "estimatedCostPence": 26,
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
                "productId": "p-turkey-mince",
                "name": "British Turkey Mince",
                "quantity": "23% of 500g",
                "estimatedCostPence": 57,
                "packages": 0.23,
                "imageUrl": null
              },
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "quantity": "10% of 410g",
                "estimatedCostPence": 5,
                "packages": 0.1,
                "imageUrl": null
              }
            ]
          },
          {
            "id": "dinner-sausage-mash-0vwlyz6",
            "title": "British Turkey Mince with mashed Maris Piper Potatoes",
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
              "Fry or grill the British Turkey Mince until browned and cooked through.",
              "Cook the Chopped Tomatoes until tender and serve everything together."
            ],
            "allergenWarnings": [],
            "productIds": [
              "p-turkey-mince",
              "p-potatoes",
              "p-chopped-tomatoes",
              "p-milk"
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
                "quantity": "17% of 400g",
                "estimatedCostPence": 8,
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
              }
            ]
          },
          {
            "category": "Food Cupboard",
            "items": [
              {
                "productId": "p-baked-beans",
                "name": "Baked Beans In Tomato Sauce",
                "brand": null,
                "packageSize": "410g",
                "quantity": 1,
                "unitPricePence": 45,
                "totalPricePence": 45,
                "productUrl": "https://www.aldi.co.uk/product/p-baked-beans",
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
          "productsUsed": 9,
          "excludedForAllergies": 0,
          "excludedForSafety": 0
        },
        "budgetUtilization": {
          "targetPercent": 80,
          "targetPence": 5600,
          "actualPence": 1513,
          "actualPercent": 22,
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
