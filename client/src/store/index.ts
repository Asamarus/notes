import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import NotesReducer from './NotesSlice';
import SectionsReducer from './SectionsSlice';
import CurrentSectionReducer from './CurrentSectionSlice';
import NavBarAutoCompleteReducer from './NavBarAutoCompleteSlice';
import NoteIsNotSavedReducer from './NoteIsNotSavedSlice';
import SourcesAdministrationReducer from './SourcesAdministrationSlice';
import SectionsAdministrationReducer from './SectionsAdministrationSlice';

export const store = configureStore({
  reducer: {
    Notes: NotesReducer,
    Sections: SectionsReducer,
    CurrentSection: CurrentSectionReducer,
    NavBarAutoComplete: NavBarAutoCompleteReducer,
    NoteIsNotSaved: NoteIsNotSavedReducer,
    SourcesAdministration: SourcesAdministrationReducer,
    SectionsAdministration: SectionsAdministrationReducer,
  },
  preloadedState: window['__PRELOADED_STATE__'],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
