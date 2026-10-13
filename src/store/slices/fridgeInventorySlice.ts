import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  type FridgeItem,
  IngredientCategory,
  IngredientUnit,
  type InventoryDeduction,
  type NewFridgeItem,
} from '@/types/fridgeInventory';
import type { RootState } from '@/store';
import { generateId } from '@/utils/uuid';

const fridgeInventoryAdapter = createEntityAdapter<FridgeItem>();

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const now = new Date().toISOString();

const mockFridgeItems: FridgeItem[] = [
  {
    id: generateId(),
    name: 'Spinach',
    quantity: 1,
    unit: IngredientUnit.BUNCH,
    category: IngredientCategory.PRODUCE,
    expirationDate: daysFromNow(5),
    addedAt: now,
  },
  {
    id: generateId(),
    name: 'Whole Milk',
    quantity: 1,
    unit: IngredientUnit.BOTTLE,
    category: IngredientCategory.DAIRY,
    expirationDate: daysFromNow(10),
    addedAt: now,
  },
  {
    id: generateId(),
    name: 'Chicken Breast',
    quantity: 4,
    unit: IngredientUnit.PIECE,
    category: IngredientCategory.PROTEIN,
    expirationDate: daysFromNow(3),
    addedAt: now,
  },
  {
    id: generateId(),
    name: 'Pasta',
    quantity: 1,
    unit: IngredientUnit.BOX,
    category: IngredientCategory.GRAIN,
    expirationDate: null,
    addedAt: now,
  },
  {
    id: generateId(),
    name: 'Ketchup',
    quantity: 1,
    unit: IngredientUnit.BOTTLE,
    category: IngredientCategory.CONDIMENT,
    expirationDate: null,
    addedAt: now,
  },
];

const initialState = fridgeInventoryAdapter.setAll(
  fridgeInventoryAdapter.getInitialState(),
  mockFridgeItems,
);

const fridgeInventorySlice = createSlice({
  name: 'fridgeInventory',
  initialState,
  reducers: {
    addItem: {
      reducer: fridgeInventoryAdapter.addOne,
      prepare: (item: NewFridgeItem) => ({
        payload: {
          ...item,
          id: generateId(),
          addedAt: new Date().toISOString(),
        } as FridgeItem,
      }),
    },
    addItems: {
      reducer: fridgeInventoryAdapter.addMany,
      prepare: (items: NewFridgeItem[]) => ({
        payload: items.map((item) => ({
          ...item,
          id: generateId(),
          addedAt: new Date().toISOString(),
        })) as FridgeItem[],
      }),
    },
    updateItem: fridgeInventoryAdapter.updateOne,
    removeItem: fridgeInventoryAdapter.removeOne,
    setAllItems: fridgeInventoryAdapter.setAll,
    // Bulk-inserts already-fully-formed FridgeItems (id/addedAt already set) as-is —
    // used to merge a scan session's staged items without regenerating their ids.
    mergeItems: fridgeInventoryAdapter.addMany,
    // Strict ID-match deduction once a recipe is marked done. Entries with no matching
    // (or null) inventoryId — i.e. pantry staples Gemini wasn't asked to track — are skipped.
    deductInventory: (state, action: PayloadAction<InventoryDeduction[]>) => {
      action.payload.forEach(({ inventoryId, quantityUsed }) => {
        const existing = state.entities[inventoryId];
        if (!existing) return;

        const remaining = existing.quantity - quantityUsed;
        if (remaining <= 0) {
          fridgeInventoryAdapter.removeOne(state, inventoryId);
        } else {
          fridgeInventoryAdapter.updateOne(state, {
            id: inventoryId,
            changes: { quantity: remaining },
          });
        }
      });
    },
  },
});

export const {
  addItem,
  addItems,
  updateItem,
  removeItem,
  setAllItems,
  mergeItems,
  deductInventory,
} = fridgeInventorySlice.actions;

export const {
  selectAll: selectAllFridgeItems,
  selectById: selectFridgeItemById,
  selectEntities: selectFridgeItemEntities,
  selectIds: selectFridgeItemIds,
} = fridgeInventoryAdapter.getSelectors((state: RootState) => state.fridgeInventory);

export default fridgeInventorySlice.reducer;
