import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'store';

export type Note = {
  id: number;
  created_at: string;
  updated_at: string;
  sync_id: string;
  section: string;
  title: string;
  book: string;
  tags: string[];
  extra: null | any;
  preview: string;
  content: string;
  search_index: string;
  sources: Source[];
};

export type Source = {
  id: string;
  link: string;
  title: string;
  description: string;
  image: string;
  showImage: boolean;
};

export type Notes = {
  section: string;
  total: number;
  ids: number[];
  rows: Record<string, Note>;
  search: string;
  book: string;
  tags: string[];
  date: string;
  withoutBook: boolean;
  withoutTags: boolean;
  inRandomOrder: boolean;
  loading: boolean;
  count: number;
  loadMore: boolean;
  page: number;
  foundWholePhrase: boolean;
  keywords: string[];
  searchTerm: string;
};

export type NotesMetaData = Pick<
  Notes,
  | 'loading'
  | 'count'
  | 'loadMore'
  | 'page'
  | 'total'
  | 'foundWholePhrase'
  | 'keywords'
  | 'searchTerm'
>;

const initialState: Notes = {
  section: '',
  total: 0,
  ids: [],
  rows: {},
  search: '',
  book: '',
  tags: [],
  date: '',
  withoutBook: false,
  withoutTags: false,
  inRandomOrder: false,
  loading: false,
  count: 0,
  loadMore: false,
  page: 1,
  foundWholePhrase: false,
  keywords: [],
  searchTerm: '',
};

export const NotesSlice = createSlice({
  name: 'Notes',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Notes>) => {
      return action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setIds: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
    },
    removeId: (state, action: PayloadAction<number>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    removeIds: (state, action: PayloadAction<number[]>) => {
      state.ids = state.ids.filter((id) => !action.payload.includes(id));
    },
    appendIds: (state, action: PayloadAction<number[]>) => {
      state.ids = [...state.ids, ...action.payload];
    },
    appendRows: (state, action: PayloadAction<Record<string, Note>>) => {
      state.rows = { ...state.rows, ...action.payload };
    },
    setMetaData: (state, action: PayloadAction<NotesMetaData>) => {
      state.loading = action.payload.loading;
      state.total = action.payload.total;
      state.count = action.payload.count;
      state.loadMore = action.payload.loadMore;
      state.page = action.payload.page;
      state.foundWholePhrase = action.payload.foundWholePhrase;
      state.keywords = action.payload.keywords;
      state.searchTerm = action.payload.searchTerm;
    },
    setRows: (state, action: PayloadAction<Record<string, Note>>) => {
      state.rows = action.payload;
    },
    setNote: (state, action: PayloadAction<Note>) => {
      state.rows[action.payload.id] = action.payload;
    },
    removeNote: (state, action: PayloadAction<string>) => {
      delete state.rows[action.payload];
    },
    setSection: (state, action: PayloadAction<string>) => {
      state.section = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setInRandomOrder: (state, action: PayloadAction<boolean>) => {
      state.inRandomOrder = action.payload;
    },
    setBook: (state, action: PayloadAction<string>) => {
      state.book = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setWithoutBook: (state, action: PayloadAction<boolean>) => {
      state.withoutBook = action.payload;
    },
    setWithoutTags: (state, action: PayloadAction<boolean>) => {
      state.withoutTags = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    decreaseTotal: (state) => {
      state.total--;
    },
    setNoteSources: (state, action: PayloadAction<{ id: number; sources: Source[] }>) => {
      state.rows[action.payload.id].sources = action.payload.sources;
    },
    setNoteBook: (state, action: PayloadAction<{ id: number; book: string }>) => {
      state.rows[action.payload.id].book = action.payload.book;
    },
    setNoteTags: (state, action: PayloadAction<{ id: number; tags: string[] }>) => {
      state.rows[action.payload.id].tags = action.payload.tags;
    },
  },
});

export const {
  set: setNotes,
  setLoading: setNotesLoading,
  setIds: setNotesIds,
  removeId: removeNotesId,
  removeIds: removeNotesIds,
  appendIds: appendNotesIds,
  appendRows: appendNotesRows,
  setMetaData: setNotesMetaData,
  setRows: setNotesRows,
  setNote: setNotesNote,
  removeNote: removeNotesNote,
  setSection: setNotesSection,
  setSearch: setNotesSearch,
  setInRandomOrder: setNotesInRandomOrder,
  setBook: setNotesBook,
  setTags: setNotesTags,
  setDate: setNotesDate,
  setWithoutBook: setNotesWithoutBook,
  setWithoutTags: setNotesWithoutTags,
  setTotal: setNotesTotal,
  decreaseTotal: decreaseNotesTotal,
  setNoteSources: setNotesNoteSources,
  setNoteBook: setNotesNoteBook,
  setNoteTags: setNotesNoteTags,
} = NotesSlice.actions;

export const selectNotes = (state: RootState) => state.Notes;

export default NotesSlice.reducer;
