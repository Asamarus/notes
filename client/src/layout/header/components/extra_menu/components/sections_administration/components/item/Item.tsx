import useStyles from './Item.styles';
import { ActionIcon, Text } from '@mantine/core';
import { useAppDispatch, useAppSelector } from 'hooks';
import { store } from 'store';
import { MdDragIndicator, MdEdit, MdDelete } from 'react-icons/md';
import EditForm from '../edit_form';
import { openModal } from 'common/modals';
import remoteRequest from 'utils/remoteRequest';
import showError from 'helpers/showError';
import { useMantineTheme } from '@mantine/core';
import { klona } from 'klona';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import {
  removeSectionsAdministrationId,
  removeSectionsAdministrationItem,
  setSectionsAdministrationIds,
  setSectionsAdministrationItem,
} from 'store/SectionsAdministrationSlice';
import { setSections } from 'store/SectionsSlice';

export interface ItemProps {
  /** Item id */
  id: string;
  /** Drag handler props */
  dragHandleProps: DraggableProvidedDragHandleProps;
}

function Item({ id, dragHandleProps }: ItemProps) {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.SectionsAdministration.items[id]);

  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.item}>
        <div {...dragHandleProps}>
          <MdDragIndicator size={25} className={classes.dragIcon} />
        </div>

        <div className={classes.color} style={{ backgroundColor: item.color }} />
        <div className={classes.title}>{item.display_name}</div>
        <ActionIcon
          size={25}
          variant="transparent"
          onClick={() => {
            openModal({
              name: 'content',
              settings: {
                title: `Edit section: #${item.id}`,
                withModalHeader: false,
                closeOnClickOutside: false,
                size: 400,
              },
              data: {
                children: <EditForm item={item} />,
              },
            });
          }}
          color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}>
          <MdEdit size={25} />
        </ActionIcon>
        <ActionIcon
          size={25}
          variant="transparent"
          onClick={() => {
            openModal({
              name: 'confirmation',
              data: {
                children: <Text size="sm">Are you sure you want to delete this section?</Text>,
                onConfirm: () => {
                  const oldIds = klona(store.getState().SectionsAdministration.ids);

                  dispatch(removeSectionsAdministrationId(id));
                  dispatch(removeSectionsAdministrationItem(id));

                  remoteRequest({
                    url: 'sections/actions',
                    data: {
                      action: 'delete',
                      id: id,
                    },
                    onSuccess: (response) => {
                      dispatch(setSections(response.sections));
                    },
                    onError: (response) => {
                      if (!store.getState().SectionsAdministration.mounted) {
                        return;
                      }
                      showError(response.msg);
                      dispatch(setSectionsAdministrationIds(oldIds));
                      dispatch(setSectionsAdministrationItem(item));
                    },
                  });
                },
              },
            });
          }}
          color={theme.colorScheme === 'dark' ? 'gray' : 'dark'}>
          <MdDelete size={25} />
        </ActionIcon>
      </div>
    </div>
  );
}

export default Item;
