// Qualitative units only — no exact weights (grams, ml). See CLAUDE.md "Unit Standardization".
export enum IngredientUnit {
  PIECE = 'piece',
  SLICE = 'slice',
  CUP = 'cup',
  BOTTLE = 'bottle',
  CAN = 'can',
  JAR = 'jar',
  BAG = 'bag',
  BOX = 'box',
  CARTON = 'carton',
  BUNCH = 'bunch',
  CLOVE = 'clove',
  PACK = 'pack',
}

export enum IngredientCategory {
  PRODUCE = 'produce',
  DAIRY = 'dairy',
  PROTEIN = 'protein',
  GRAIN = 'grain',
  CONDIMENT = 'condiment',
  SPICE = 'spice',
  BEVERAGE = 'beverage',
  BAKERY = 'bakery',
  FROZEN = 'frozen',
  OTHER = 'other',
}

export interface FridgeItem {
  /** UUID — doubles as the `inventory_id` Gemini must echo back for ID Injection deduction. */
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
  category: IngredientCategory;
  expirationDate: string | null;
  addedAt: string;
}

export type NewFridgeItem = Omit<FridgeItem, 'id' | 'addedAt'>;

export interface InventoryDeduction {
  inventoryId: string;
  quantityUsed: number;
}
