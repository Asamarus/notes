import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

const initialState = false;

export const NoteIsNotSavedSlice = createSlice({
  name: 'NoteIsNotSaved',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { set: setNoteIsNotSaved } = NoteIsNotSavedSlice.actions;

export const selectNoteIsNotSaved = (state: RootState) => state.NoteIsNotSaved;

export default NoteIsNotSavedSlice.reducer;
