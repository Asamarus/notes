import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

export type SectionItem = {
  id: number;
  sync_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  display_name: string;
  color: string;
  position: number;
};

export type SectionsAdministration = {
  mounted: boolean;
  loading: boolean;
  ids: string[];
  items: Record<string, SectionItem>;
};

const initialState: SectionsAdministration = { mounted: false, loading: false, ids: [], items: {} };

export const SectionsAdministrationSlice = createSlice({
  name: 'SectionsAdministration',
  initialState,
  reducers: {
    setMounted: (state, action: PayloadAction<boolean>) => {
      state.mounted = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIds: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
    },
    removeId: (state, action: PayloadAction<string>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    appendId: (state, action: PayloadAction<string>) => {
      state.ids = [...state.ids, action.payload];
    },
    appendIds: (state, action: PayloadAction<string[]>) => {
      state.ids = [...state.ids, ...action.payload];
    },
    setItems: (state, action: PayloadAction<Record<string, SectionItem>>) => {
      state.items = action.payload;
    },
    setItem: (state, action: PayloadAction<SectionItem>) => {
      state.items[action.payload.id] = action.payload;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    clear: () => {
      return initialState;
    },
  },
});

export const {
  setMounted: setSectionsAdministrationMounted,
  setLoading: setSectionsAdministrationLoading,
  setIds: setSectionsAdministrationIds,
  removeId: removeSectionsAdministrationId,
  setItems: setSectionsAdministrationItems,
  clear: clearSectionsAdministration,
  appendId: appendSectionsAdministrationId,
  appendIds: appendSectionsAdministrationIds,
  setItem: setSectionsAdministrationItem,
  removeItem: removeSectionsAdministrationItem,
} = SectionsAdministrationSlice.actions;

export const selectSectionsAdministration = (state: RootState) => state.SectionsAdministration;

export default SectionsAdministrationSlice.reducer;
