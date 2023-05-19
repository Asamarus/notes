import { useEffect } from 'react';
import Loading from 'common/ui/loading';
import remoteRequest from 'utils/remoteRequest';
import { useAppSelector, useAppDispatch } from 'hooks';
import { store } from 'store';
import showError from 'helpers/showError';
import { Button } from '@mantine/core';
import { MdAdd } from 'react-icons/md';
import AddForm from './components/add_form';
import { openModal } from 'common/modals';
import Item from './components/item';
import SortableList from 'common/ui/sortable_list';
import { Note as NoteData, setNotesNoteSources } from 'store/NotesSlice';
import {
  clearSourcesAdministration,
  setSourcesAdministrationIds,
  setSourcesAdministrationItems,
  setSourcesAdministrationLoading,
  setSourcesAdministrationMounted,
} from 'store/SourcesAdministrationSlice';

export interface SourcesAdministrationProps {
  /** Note */
  note: NoteData;
}

function SourcesAdministration({ note }: SourcesAdministrationProps) {
  const dispatch = useAppDispatch();

  const { ids, loading } = useAppSelector((state) => {
    return {
      ids: state.SourcesAdministration.ids,
      loading: state.SourcesAdministration.loading,
    };
  });

  useEffect(() => {
    dispatch(setSourcesAdministrationMounted(true));
    dispatch(setSourcesAdministrationLoading(true));

    remoteRequest({
      url: 'sources/actions',
      data: {
        action: 'get',
        id: note.id,
      },
      onSuccess: (response) => {
        if (!store.getState().SourcesAdministration.mounted) {
          return;
        }

        const items = {};

        response?.items.forEach((i) => {
          items[i['id']] = i;
        });

        const ids = response?.items?.map((i) => i['id']);

        dispatch(setSourcesAdministrationLoading(false));
        dispatch(setSourcesAdministrationItems(items));
        dispatch(setSourcesAdministrationIds(ids));
      },
      onError: (response) => {
        if (!store.getState().SourcesAdministration.mounted) {
          return;
        }
        showError(response.msg);
      },
    });
    return () => {
      dispatch(clearSourcesAdministration());
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Button
        leftIcon={<MdAdd size={20} />}
        onClick={() => {
          openModal({
            name: 'content',
            settings: {
              title: 'Add new source',
              withModalHeader: false,
              closeOnClickOutside: false,
              size: 500,
            },
            data: { children: <AddForm note={note} /> },
          });
        }}
        mb={20}>
        Add new source
      </Button>

      <SortableList
        items={ids}
        onSortEnd={(newItems) => {
          dispatch(setSourcesAdministrationIds(newItems));
          remoteRequest({
            url: 'sources/actions',
            data: {
              action: 'reorder',
              id: note.id,
              ids: newItems.join(','),
            },
            onSuccess: (response) => {
              dispatch(setNotesNoteSources({ id: note.id, sources: response.sources }));
            },
          });
        }}
        renderItem={(id, dragHandleProps) => {
          return <Item id={id} dragHandleProps={dragHandleProps} note={note} />;
        }}
      />
    </>
  );
}

export default SourcesAdministration;
