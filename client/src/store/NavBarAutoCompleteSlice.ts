import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

type NavBarAutoComplete = {
  value: string;
  valueId: string;
};

const initialState: NavBarAutoComplete = { value: '', valueId: '' };

export const NavBarAutoCompletesSlice = createSlice({
  name: 'NavBarAutoComplete',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<NavBarAutoComplete>) => {
      return action.payload;
    },
  },
});

export const { set: setNavBarAutoComplete } = NavBarAutoCompletesSlice.actions;

export const selectNavBarAutoComplete = (state: RootState) => state.NavBarAutoComplete;

export default NavBarAutoCompletesSlice.reducer;
