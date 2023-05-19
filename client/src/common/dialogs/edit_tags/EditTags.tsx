import { useEffect, useRef } from 'react';
import useIsMounted from 'hooks/use-is-mounted';
import { Note as NoteData, setNotesNoteTags } from 'store/NotesSlice';
import { Box, Loader, ScrollArea } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import remoteRequest from 'utils/remoteRequest';
import showError from 'helpers/showError';
import get from 'lodash/get';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { useMantineTheme } from '@mantine/core';
import ControlButtons from '../components/control_buttons';
import List from '../components/list';
import TagsInput from '../components/tags_input';
import isEmpty from 'helpers/isEmpty';
import getRows from 'helpers/getRows';
import { closeModal } from 'common/modals';
import { useAppDispatch } from 'hooks';
import inArray from 'helpers/inArray';

export interface EditBookProps {
  /** Note */
  note: NoteData;
}

function onSelect({ note, tags }, dispatch) {
  dispatch(setNotesNoteTags({ id: note.id, tags: tags.current }));

  remoteRequest({
    url: '/notes/actions',
    data: {
      action: 'update_tags',
      id: note.id,
      tags: tags.current.join(','),
    },
  });

  closeModal('modal');
}

function EditTags({ note }: EditBookProps) {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const tags = useRef(!isEmpty(note.tags) ? note.tags : []);
  const tagsInput = useRef(null);
  const isMounted = useIsMounted();
  const [state, setState] = useSetState({
    ids: [],
    rows: {},
    loading: true,
    tags: [],
  });

  useEffect(() => {
    remoteRequest({
      url: 'tags/search',
      data: {
        section: note.section,
      },
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

        setState({
          ids,
          rows,
          loading: false,
        });
      },
      onError: (response) => {
        showError(response.msg);
      },
    });
  }, []);

  const { loading, ids, rows } = state;

  const onConfirm = () => {
    onSelect({ note, tags: tags }, dispatch);
  };
  const onCancel = () => {
    closeModal('modal');
  };

  if (loading) {
    return (
      <Box
        sx={() => ({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        })}>
        <Loader size={40} color={theme.colorScheme === 'dark' ? 'red' : 'dark'} />
      </Box>
    );
  }

  let _rows = getRows(rows, ids);

  _rows = map(_rows, (r) => {
    return {
      id: r.id,
      name: r.name,
      title: `${r.name} (${r.number})`,
      checked: inArray(r.name, tags.current),
    };
  });

  return (
    <>
      <TagsInput
        ref={tagsInput}
        onChange={(newTags) => {
          tags.current = [...newTags];

          setState({ tags: [...newTags] });
        }}
        {...(!isEmpty(note.tags) ? { initialTags: note.tags } : {})}
      />
      <ScrollArea
        sx={() => ({
          height: 'calc(100% - 142px)',
        })}>
        <List
          items={_rows}
          onSelect={({ name }) => {
            if (!inArray(name, tags.current)) {
              tagsInput?.current?.addTag(name);
            } else {
              tagsInput?.current?.removeTag(name);
            }
          }}
          withCheckboxes
        />
      </ScrollArea>
      <ControlButtons
        cancelTitle="Cancel"
        onCancelClick={onCancel}
        confirmTitle="Apply"
        onConfirmClick={onConfirm}
      />
    </>
  );
}

export default EditTags;
