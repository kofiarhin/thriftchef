export interface AldiCategory {
  key: string;
  url: string;
  categoryPath: string[];
  enabled: boolean;
}

/**
 * Only add category URLs that have been manually confirmed on aldi.co.uk.
 * Product identity is based on Aldi's product ID, so products shared by
 * multiple categories are merged rather than duplicated.
 */
export const ALDI_CATEGORIES: AldiCategory[] = [
  {
    key: "frozen-vegetables-sides",
    url: "https://www.aldi.co.uk/products/frozen-food/vegetables-sides/k/1588161416978056004",
    categoryPath: ["Frozen Food", "Vegetables & Sides"],
    enabled: true,
  },
];
