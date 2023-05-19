import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

type CurrentSection = {
  name: string;
  displayName: string;
  color: string;
};

const initialState: CurrentSection = { name: '', displayName: '', color: '' };

export const CurrentSectionsSlice = createSlice({
  name: 'CurrentSection',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<CurrentSection>) => {
      return action.payload;
    },
  },
});

export const { set: setCurrentSection } = CurrentSectionsSlice.actions;

export const selectCurrentSection = (state: RootState) => state.CurrentSection;

export default CurrentSectionsSlice.reducer;
