import { useEffect, useRef } from 'react';
import useIsMounted from 'hooks/use-is-mounted';
import { Note as NoteData, setNotesNoteBook } from 'store/NotesSlice';
import { Box, Loader, ScrollArea } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import remoteRequest from 'utils/remoteRequest';
import showError from 'helpers/showError';
import get from 'lodash/get';
import map from 'lodash/map';
import filter from 'lodash/filter';
import escapeRegExp from 'lodash/escapeRegExp';
import forEach from 'lodash/forEach';
import { useMantineTheme } from '@mantine/core';
import ControlButtons from '../components/control_buttons';
import List from '../components/list';
import SearchInput from '../components/search_input';
import isEmpty from 'helpers/isEmpty';
import getRows from 'helpers/getRows';
import { closeModal } from 'common/modals';
import { useAppDispatch } from 'hooks';

export interface EditBookProps {
  /** Note */
  note: NoteData;
}

function onSelect({ note, book }, dispatch) {
  dispatch(setNotesNoteBook({ id: note.id, book }));

  remoteRequest({
    url: '/notes/actions',
    data: {
      action: 'update_book',
      id: note.id,
      book: book,
    },
  });

  closeModal('modal');
}

function EditBook({ note }: EditBookProps) {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const book = useRef(!isEmpty(note.book) ? note.book : '');
  const isMounted = useIsMounted();
  const [state, setState] = useSetState({
    search: '',
    ids: [],
    rows: {},
    loading: true,
  });

  useEffect(() => {
    remoteRequest({
      url: 'books/search',
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

  const { loading, ids, rows, search } = state;

  const onConfirm = () => {
    onSelect({ note, book: book.current }, dispatch);
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
    };
  });

  _rows = filter(_rows, (row) => {
    if (search.length === 0) {
      return true;
    }

    return row.name.search(new RegExp(escapeRegExp(search), 'i')) >= 0;
  });

  return (
    <>
      <SearchInput
        placeholder="Change book"
        onSearch={(value) => {
          if (!isMounted()) {
            return;
          }

          setState({
            search: value,
          });
        }}
        onChange={(value) => {
          book.current = value;
        }}
        onSubmit={(value) => {
          onConfirm();
        }}
        {...(!isEmpty(note.book) ? { initialValue: note.book } : {})}
      />
      <ScrollArea
        sx={() => ({
          height: 'calc(100% - 84px)',
        })}>
        <List
          items={_rows}
          onSelect={({ name }) => {
            onSelect({ note, book: name }, dispatch);
          }}
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

export default EditBook;
