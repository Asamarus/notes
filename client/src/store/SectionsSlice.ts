import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

type Section = {
  id: number;
  sync_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  display_name: string;
  color: string;
  position: number;
};

const initialState: Section[] = [];

export const SectionsSlice = createSlice({
  name: 'Sections',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Section[]>) => {
      return action.payload;
    },
  },
});

export const { set: setSections } = SectionsSlice.actions;

export const selectSections = (state: RootState) => state.Sections;

export default SectionsSlice.reducer;
