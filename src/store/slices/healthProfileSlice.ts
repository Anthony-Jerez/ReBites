import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  type HealthProfile,
  type HealthProfileState,
  SkillLevel,
} from '@/types/healthProfile';
import { generateId } from '@/utils/uuid';

const defaultProfile: HealthProfile = {
  id: generateId(),
  dietaryRestrictions: [],
  allergies: [],
  preferredCuisines: [],
  servings: 2,
  skillLevel: SkillLevel.BEGINNER,
};

const initialState: HealthProfileState = {
  profile: defaultProfile,
  isOnboarded: false,
};

const healthProfileSlice = createSlice({
  name: 'healthProfile',
  initialState,
  reducers: {
    setHealthProfile: (state, action: PayloadAction<HealthProfile>) => {
      state.profile = action.payload;
      state.isOnboarded = true;
    },
    updateHealthProfile: (state, action: PayloadAction<Partial<HealthProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    resetHealthProfile: (state) => {
      state.profile = { ...defaultProfile, id: generateId() };
      state.isOnboarded = false;
    },
  },
});

export const { setHealthProfile, updateHealthProfile, resetHealthProfile } =
  healthProfileSlice.actions;

export default healthProfileSlice.reducer;
