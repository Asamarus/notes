import { useEffect } from 'react';
import Loading from 'common/ui/loading';
import remoteRequest from 'utils/remoteRequest';
import { useAppDispatch, useAppSelector } from 'hooks';
import { store } from 'store';
import showError from 'helpers/showError';
import { Button } from '@mantine/core';
import { MdAdd } from 'react-icons/md';
import AddForm from './components/add_form';
import { openModal } from 'common/modals';
import Item from './components/item';
import SortableList from 'common/ui/sortable_list';
import {
  clearSectionsAdministration,
  setSectionsAdministrationIds,
  setSectionsAdministrationItems,
  setSectionsAdministrationLoading,
  setSectionsAdministrationMounted,
} from 'store/SectionsAdministrationSlice';
import { setSections } from 'store/SectionsSlice';

function SectionsAdministration() {
  const dispatch = useAppDispatch();
  const { ids, loading } = useAppSelector((state) => ({
    ids: state.SectionsAdministration.ids,
    loading: state.SectionsAdministration.loading,
  }));

  useEffect(() => {
    dispatch(setSectionsAdministrationMounted(true));
    dispatch(setSectionsAdministrationLoading(true));

    remoteRequest({
      url: 'sections/actions',
      data: {
        action: 'get',
      },
      onSuccess: (response) => {
        if (!store.getState().SectionsAdministration.mounted) {
          return;
        }

        const items = {};

        response?.items.forEach((i) => {
          items[i['id']] = i;
        });

        const ids = response?.items?.map((i) => i['id']);

        dispatch(setSectionsAdministrationLoading(false));
        dispatch(setSectionsAdministrationItems(items));
        dispatch(setSectionsAdministrationIds(ids));
      },
      onError: (response) => {
        if (!store.getState().SectionsAdministration.mounted) {
          return;
        }
        showError(response.msg);
      },
    });
    return () => {
      dispatch(clearSectionsAdministration());
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
              title: 'Add new section',
              withModalHeader: false,
              closeOnClickOutside: false,
              size: 400,
            },
            data: { children: <AddForm /> },
          });
        }}
        mb={20}>
        Add new section
      </Button>

      <SortableList
        items={ids}
        onSortEnd={(newTtems) => {
          dispatch(setSectionsAdministrationIds(newTtems));

          remoteRequest({
            url: 'sections/actions',
            data: {
              action: 'reorder',
              ids: newTtems.join(','),
            },
            onSuccess: (response) => {
              dispatch(setSections(response.sections));
            },
          });
        }}
        renderItem={(id, dragHandleProps) => {
          return <Item id={id} dragHandleProps={dragHandleProps} />;
        }}
      />
    </>
  );
}

export default SectionsAdministration;
