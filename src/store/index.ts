import { configureStore } from '@reduxjs/toolkit';

import fridgeInventoryReducer from '@/store/slices/fridgeInventorySlice';
import healthProfileReducer from '@/store/slices/healthProfileSlice';
import scanSessionReducer from '@/store/slices/scanSessionSlice';

export const store = configureStore({
  reducer: {
    healthProfile: healthProfileReducer,
    fridgeInventory: fridgeInventoryReducer,
    scanSession: scanSessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
