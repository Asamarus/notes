import { useEffect, useRef } from 'react';
import { useSearchParams, useLocation, useNavigationType } from 'react-router-dom';
import { store } from 'store';
import rison from 'utils/rison';
import isEmpty from 'helpers/isEmpty';
import useCustomEventListener from 'hooks/use-custom-event-listener';
import events from 'common/events';
import toInteger from 'lodash/toInteger';
import get from 'lodash/get';
import randomId from 'utils/random-id';
import {
  setNotesBook,
  setNotesDate,
  setNotesInRandomOrder,
  setNotesSearch,
  setNotesTags,
  setNotesWithoutBook,
  setNotesWithoutTags,
} from 'store/NotesSlice';
import { setNavBarAutoComplete } from 'store/NavBarAutoCompleteSlice';

export interface ListSyncWithUrlProps {
  /** On search callback*/
  onSearch: () => void;
}

function updateFromUrl({ params, onSearch }) {
  const search = get(params, 'search', '');
  store.dispatch(setNotesSearch(get(params, 'search', '')));
  store.dispatch(setNotesBook(get(params, 'book', '')));
  store.dispatch(setNotesTags(get(params, 'tags', [])));
  store.dispatch(setNotesDate(get(params, 'date', '')));
  store.dispatch(setNotesInRandomOrder(!!toInteger(get(params, 'inRandomOrder'))));
  store.dispatch(setNotesWithoutBook(!!toInteger(get(params, 'withoutBook'))));
  store.dispatch(setNotesWithoutTags(!!toInteger(get(params, 'withoutTags'))));

  store.dispatch(setNavBarAutoComplete({ value: search, valueId: randomId() }));

  onSearch();
}

function updateUrl({ urlParams, setSearchParams }) {
  const notesData = store.getState().Notes;

  const state = {};

  if (!isEmpty(notesData.search)) {
    state['search'] = notesData.search;
  }

  if (!isEmpty(notesData.book)) {
    state['book'] = notesData.book;
  }

  if (!isEmpty(notesData.tags)) {
    state['tags'] = notesData.tags;
  }

  if (!isEmpty(notesData.date)) {
    state['date'] = notesData.date;
  }

  if (notesData.inRandomOrder) {
    state['inRandomOrder'] = notesData.inRandomOrder;
  }

  if (notesData.withoutBook) {
    state['withoutBook'] = notesData.withoutBook;
  }

  if (notesData.withoutTags) {
    state['withoutTags'] = notesData.withoutTags;
  }

  urlParams.set('list', rison.encode(state));
  setSearchParams(urlParams);
}

function init({ onSearch, urlParams, setSearchParams }) {
  updateUrl({ urlParams, setSearchParams });
  onSearch();
}

function ListSyncWithUrl({ onSearch }: ListSyncWithUrlProps) {
  const location = useLocation();
  const navType = useNavigationType();
  const [urlParams, setSearchParams] = useSearchParams();

  const list = urlParams.get('list');

  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      if (!isEmpty(list)) {
        updateFromUrl({ params: rison.decode(list), onSearch });
      } else {
        init({ onSearch, urlParams, setSearchParams });
      }
    } else {
      if (navType === 'POP' && !isEmpty(list)) {
        updateFromUrl({ params: rison.decode(list), onSearch });
      }
    }
  }, [location.key]);

  useCustomEventListener(events.list.updateUrl, () => {
    updateUrl({ urlParams, setSearchParams });
  });

  return <></>;
}

export default ListSyncWithUrl;
