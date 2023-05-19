import React, { useRef, useCallback } from 'react';
import { useAppSelector } from 'hooks';
import { store } from 'store';
import { useWindowEvent } from '@mantine/hooks';
import useIsMounted from 'hooks/use-is-mounted';
import remoteRequest from 'utils/remoteRequest';
import isEmpty from 'helpers/isEmpty';
import get from 'lodash/get';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import showError from 'helpers/showError';
import Masonry from 'common/ui/masonry';
import NoteListItem from 'common/note_list_item';
import LoadMore from './components/load_more';
import Loading from 'common/ui/loading';
import ListSyncWithUrl from './components/list_sync_with_url';
import useCustomEventListener, { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import {
  setNotesIds,
  setNotesLoading,
  appendNotesRows,
  setNotesMetaData,
  setNotesRows,
  appendNotesIds,
} from 'store/NotesSlice';
import type { NotesMetaData } from 'store/NotesSlice';

const getGridProps = () => {
  return {
    gutter: 10,
    minWidth: 200,
  };
};

function search({ page, localData, isMounted }) {
  localData.current.loading = true;
  store.dispatch(setNotesLoading(true));

  if (page === 1) {
    store.dispatch(setNotesIds([]));
  }

  const data = {};
  const notesData = store.getState().Notes;

  if (notesData.section !== 'all') {
    data['section'] = notesData.section;
  }

  if (!isEmpty(notesData.search)) {
    data['search'] = notesData.search;
  }

  data['page'] = page;

  const filters = {};

  if (!isEmpty(notesData.book)) {
    filters['book'] = notesData.book;
  }

  if (!isEmpty(notesData.tags)) {
    filters['tags'] = notesData.tags;
  }

  if (!isEmpty(notesData.date)) {
    filters['date_from'] = notesData.date;
    filters['date_to'] = notesData.date;
  }

  if (notesData.withoutBook) {
    filters['without_book'] = 1;
  }

  if (notesData.withoutTags) {
    filters['without_tags'] = 1;
  }

  data['filters'] = filters;

  if (notesData.inRandomOrder) {
    data['order'] = 'random';
  } else if (isEmpty(notesData.search)) {
    data['order'] = {
      created_at: 'desc',
    };
  }

  remoteRequest({
    url: '/notes/search',
    data: data,
    onSuccess: (response) => {
      if (!isMounted()) {
        return;
      }

      const responseRows = get(response, 'rows', []);

      const ids = map(responseRows, (row) => {
        return row.id;
      });

      const rows = {};

      forEach(responseRows, (row) => {
        rows[row.id] = row;
      });

      localData.current.loadMore = get(response, 'loadMore', false);
      localData.current.page = get(response, 'page', 1);
      localData.current.loading = false;

      if (page === 1) {
        store.dispatch(setNotesIds(ids));
        store.dispatch(setNotesRows(rows));
      } else {
        store.dispatch(appendNotesIds(ids));
        store.dispatch(appendNotesRows(rows));
      }

      const metaData: NotesMetaData = {
        loading: false,
        count: get(response, 'count', 0),
        loadMore: get(response, 'loadMore', false),
        page: get(response, 'page', 1),
        total: get(response, 'total', 0),
        foundWholePhrase: get(response, 'foundWholePhrase', false),
        keywords: get(response, 'keywords', []),
        searchTerm: get(response, 'searchTerm', ''),
      };
      store.dispatch(setNotesMetaData(metaData));
    },
    onError: (response) => {
      if (!isMounted()) {
        return;
      }
      showError(response.msg);
    },
  });
}

function List() {
  const isMounted = useIsMounted();
  const localData = useRef({ page: 1, loadMore: true, loading: false });
  const { ids, loadMore, loading } = useAppSelector((state) => {
    return {
      ids: state.Notes.ids,
      loadMore: state.Notes.loadMore,
      loading: state.Notes.loading,
    };
  });

  useCustomEventListener(events.list.search, () => {
    search({ page: 1, localData, isMounted });
    dispatchEvent(events.list.updateUrl);
  });

  useWindowEvent('scroll', () => {
    if (window.scrollY + window.innerHeight === document.body.scrollHeight) {
      onLoadMore();
    }
  });

  const onSyncWithUrlSearch = useCallback(() => {
    search({ page: 1, localData, isMounted });
  }, [isMounted]);

  const onLoadMore = () => {
    if (!localData.current.loading && localData.current.loadMore) {
      const page = localData.current.page;
      search({ page: page + 1, localData, isMounted });
    }
  };

  const renderList = () => {
    if (isEmpty(ids)) {
      return null;
    }

    if (!Array.isArray(ids)) {
      return null;
    }

    return (
      <Masonry getGridProps={getGridProps}>
        {ids.map((id, index) => (
          <NoteListItem key={`${id}-${index}`} id={id} />
        ))}
      </Masonry>
    );
  };

  const renderLoading = () => {
    if (loading && isEmpty(ids)) {
      return <Loading />;
    }
  };

  const renderLoadMore = () => {
    if (!loadMore) {
      return null;
    }

    if (loading && isEmpty(ids)) {
      return null;
    }

    return <LoadMore loading={loading} onClick={onLoadMore} />;
  };

  return (
    <>
      {renderList()}
      {renderLoading()}
      {renderLoadMore()}
      <ListSyncWithUrl onSearch={onSyncWithUrlSearch} />
    </>
  );
}

export default React.memo(List);
