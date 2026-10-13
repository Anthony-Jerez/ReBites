import { type FridgeItem, IngredientCategory, IngredientUnit } from '@/types/fridgeInventory';
import { generateId } from '@/utils/uuid';

// Stands in for the FastAPI + Qwen (Groq) vision endpoint until it's wired up.
const SCAN_DELAY_MS = 1000;

interface MockCandidate {
  name: string;
  unit: IngredientUnit;
  category: IngredientCategory;
  quantityRange: [number, number];
}

const MOCK_CANDIDATE_POOL: MockCandidate[] = [
  { name: 'Tomatoes', unit: IngredientUnit.PIECE, category: IngredientCategory.PRODUCE, quantityRange: [2, 6] },
  { name: 'Bell Peppers', unit: IngredientUnit.PIECE, category: IngredientCategory.PRODUCE, quantityRange: [1, 4] },
  { name: 'Carrots', unit: IngredientUnit.BUNCH, category: IngredientCategory.PRODUCE, quantityRange: [1, 1] },
  { name: 'Broccoli', unit: IngredientUnit.PIECE, category: IngredientCategory.PRODUCE, quantityRange: [1, 2] },
  { name: 'Onions', unit: IngredientUnit.PIECE, category: IngredientCategory.PRODUCE, quantityRange: [2, 5] },
  { name: 'Garlic', unit: IngredientUnit.CLOVE, category: IngredientCategory.PRODUCE, quantityRange: [3, 8] },
  { name: 'Cheddar Cheese', unit: IngredientUnit.SLICE, category: IngredientCategory.DAIRY, quantityRange: [4, 10] },
  { name: 'Greek Yogurt', unit: IngredientUnit.CUP, category: IngredientCategory.DAIRY, quantityRange: [1, 4] },
  { name: 'Butter', unit: IngredientUnit.PACK, category: IngredientCategory.DAIRY, quantityRange: [1, 2] },
  { name: 'Eggs', unit: IngredientUnit.PIECE, category: IngredientCategory.DAIRY, quantityRange: [6, 12] },
  { name: 'Ground Beef', unit: IngredientUnit.PACK, category: IngredientCategory.PROTEIN, quantityRange: [1, 2] },
  { name: 'Salmon Fillet', unit: IngredientUnit.PIECE, category: IngredientCategory.PROTEIN, quantityRange: [1, 3] },
  { name: 'Tofu', unit: IngredientUnit.PACK, category: IngredientCategory.PROTEIN, quantityRange: [1, 2] },
  { name: 'Bread', unit: IngredientUnit.PACK, category: IngredientCategory.BAKERY, quantityRange: [1, 1] },
  { name: 'Bagels', unit: IngredientUnit.PIECE, category: IngredientCategory.BAKERY, quantityRange: [2, 6] },
  { name: 'Orange Juice', unit: IngredientUnit.BOTTLE, category: IngredientCategory.BEVERAGE, quantityRange: [1, 1] },
  { name: 'Sparkling Water', unit: IngredientUnit.CAN, category: IngredientCategory.BEVERAGE, quantityRange: [2, 6] },
  { name: 'Frozen Peas', unit: IngredientUnit.BAG, category: IngredientCategory.FROZEN, quantityRange: [1, 2] },
  { name: 'Ice Cream', unit: IngredientUnit.PACK, category: IngredientCategory.FROZEN, quantityRange: [1, 1] },
  { name: 'Soy Sauce', unit: IngredientUnit.BOTTLE, category: IngredientCategory.CONDIMENT, quantityRange: [1, 1] },
  { name: 'Mustard', unit: IngredientUnit.JAR, category: IngredientCategory.CONDIMENT, quantityRange: [1, 1] },
  { name: 'Rice', unit: IngredientUnit.BAG, category: IngredientCategory.GRAIN, quantityRange: [1, 1] },
  { name: 'Black Pepper', unit: IngredientUnit.JAR, category: IngredientCategory.SPICE, quantityRange: [1, 1] },
];

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomInRange([min, max]: [number, number]): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Simulates the vision inference round trip: returns 2-4 plausible fridge items
// with no expiration date set (the model isn't reliable at estimating those).
export function scanImageForIngredients(): Promise<FridgeItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const count = 2 + Math.floor(Math.random() * 3);
      const addedAt = new Date().toISOString();
      const items: FridgeItem[] = shuffled(MOCK_CANDIDATE_POOL)
        .slice(0, count)
        .map((candidate) => ({
          id: generateId(),
          name: candidate.name,
          quantity: randomInRange(candidate.quantityRange),
          unit: candidate.unit,
          category: candidate.category,
          expirationDate: null,
          addedAt,
        }));
      resolve(items);
    }, SCAN_DELAY_MS);
  });
}
