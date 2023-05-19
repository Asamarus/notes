import useStyles from './Item.styles';
import { useAppSelector, useAppDispatch } from 'hooks';
import { store } from 'store';
import { ActionIcon, Text, Anchor } from '@mantine/core';
import { MdDragIndicator, MdEdit, MdDelete } from 'react-icons/md';
import EditForm from '../edit_form';
import { openModal } from 'common/modals';
import remoteRequest from 'utils/remoteRequest';
import showError from 'helpers/showError';
import { useMantineTheme } from '@mantine/core';
import { klona } from 'klona';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Note as NoteData, setNotesNoteSources } from 'store/NotesSlice';
import {
  removeSourcesAdministrationId,
  removeSourcesAdministrationItem,
  setSourcesAdministrationItem,
  setSourcesAdministrationIds,
} from 'store/SourcesAdministrationSlice';

export interface ItemProps {
  /** Note */
  note: NoteData;

  /** Item id */
  id: string;

  /** Drag handler props */
  dragHandleProps: DraggableProvidedDragHandleProps;
}

function Item({ id, dragHandleProps, note }: ItemProps) {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();

  const { item } = useAppSelector((state) => {
    return {
      item: state.SourcesAdministration.items[id],
    };
  });

  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.item}>
        <div {...dragHandleProps}>
          <MdDragIndicator size={25} className={classes.dragIcon} />
        </div>

        <div className={classes.content}>
          <Anchor href={item.link} target="_blank">
            <div>{item.title}</div>
            <div>{item.link}</div>
          </Anchor>
        </div>

        <ActionIcon
          size={25}
          variant="transparent"
          onClick={() => {
            openModal({
              name: 'content',
              settings: {
                title: `Edit source: #${item.id}`,
                withModalHeader: false,
                closeOnClickOutside: false,
                size: 500,
              },
              data: {
                children: <EditForm item={item} note={note} />,
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
                children: <Text size="sm">Are you sure you want to delete this source?</Text>,
                onConfirm: () => {
                  const oldIds = klona(store.getState().SourcesAdministration.ids);

                  dispatch(removeSourcesAdministrationId(id));
                  dispatch(removeSourcesAdministrationItem(id));

                  remoteRequest({
                    url: 'sources/actions',
                    data: {
                      action: 'delete',
                      id: note.id,
                      source_id: id,
                    },
                    onSuccess: (response) => {
                      dispatch(setNotesNoteSources({ id: note.id, sources: response.sources }));
                    },
                    onError: (response) => {
                      if (store.getState().SourcesAdministration.mounted === false) {
                        return;
                      }

                      showError(response.msg);
                      dispatch(setSourcesAdministrationIds(oldIds));
                      dispatch(setSourcesAdministrationItem(item));
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
