import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { FridgeItem } from '@/types/fridgeInventory';

interface ItemEdit {
  id: string;
  changes: Partial<FridgeItem>;
}

interface ScanSessionState {
  stagedItems: FridgeItem[];
  currentPhotoCandidates: FridgeItem[];
  isProcessing: boolean;
}

const initialState: ScanSessionState = {
  stagedItems: [],
  currentPhotoCandidates: [],
  isProcessing: false,
};

const scanSessionSlice = createSlice({
  name: 'scanSession',
  initialState,
  reducers: {
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setPhotoCandidates: (state, action: PayloadAction<FridgeItem[]>) => {
      state.currentPhotoCandidates = action.payload;
      state.isProcessing = false;
    },
    updatePhotoCandidate: (state, action: PayloadAction<ItemEdit>) => {
      const item = state.currentPhotoCandidates.find((i) => i.id === action.payload.id);
      if (item) Object.assign(item, action.payload.changes);
    },
    removePhotoCandidate: (state, action: PayloadAction<string>) => {
      state.currentPhotoCandidates = state.currentPhotoCandidates.filter(
        (item) => item.id !== action.payload,
      );
    },
    // Moves the current photo's verified candidates into the cross-photo staging
    // list, so the next photo's candidates don't overwrite earlier ones.
    stageCurrentCandidates: (state) => {
      state.stagedItems.push(...state.currentPhotoCandidates);
      state.currentPhotoCandidates = [];
    },
    updateStagedItem: (state, action: PayloadAction<ItemEdit>) => {
      const item = state.stagedItems.find((i) => i.id === action.payload.id);
      if (item) Object.assign(item, action.payload.changes);
    },
    removeStagedItem: (state, action: PayloadAction<string>) => {
      state.stagedItems = state.stagedItems.filter((item) => item.id !== action.payload);
    },
    clearSession: (state) => {
      state.stagedItems = [];
      state.currentPhotoCandidates = [];
      state.isProcessing = false;
    },
  },
});

export const {
  setProcessing,
  setPhotoCandidates,
  updatePhotoCandidate,
  removePhotoCandidate,
  stageCurrentCandidates,
  updateStagedItem,
  removeStagedItem,
  clearSession,
} = scanSessionSlice.actions;

export default scanSessionSlice.reducer;
