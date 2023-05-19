import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

export type SourceItem = {
  id: string;
  link: string;
  title: string;
  description: string;
  image: string;
  showImage: boolean;
};

export type SourcesAdministration = {
  mounted: boolean;
  loading: boolean;
  ids: string[];
  items: Record<string, SourceItem>;
};

const initialState: SourcesAdministration = { mounted: false, loading: false, ids: [], items: {} };

export const SourcesAdministrationSlice = createSlice({
  name: 'SourcesAdministration',
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
    setItems: (state, action: PayloadAction<Record<string, SourceItem>>) => {
      state.items = action.payload;
    },
    setItem: (state, action: PayloadAction<SourceItem>) => {
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
  setMounted: setSourcesAdministrationMounted,
  setLoading: setSourcesAdministrationLoading,
  setIds: setSourcesAdministrationIds,
  removeId: removeSourcesAdministrationId,
  setItems: setSourcesAdministrationItems,
  clear: clearSourcesAdministration,
  appendId: appendSourcesAdministrationId,
  appendIds: appendSourcesAdministrationIds,
  setItem: setSourcesAdministrationItem,
  removeItem: removeSourcesAdministrationItem,
} = SourcesAdministrationSlice.actions;

export const selectSourcesAdministration = (state: RootState) => state.SourcesAdministration;

export default SourcesAdministrationSlice.reducer;
