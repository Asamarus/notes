import { useRef, useEffect } from 'react';
import { Autocomplete, Loader, CloseButton } from '@mantine/core';
import { MdSearch } from 'react-icons/md';
import { useSetState } from '@mantine/hooks';
import { useAppSelector, useAppDispatch } from 'hooks';
import debounce from 'lodash/debounce';
import remoteRequest from 'utils/remoteRequest';
import { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import { openModal } from 'common/modals';
import { useMantineTheme } from '@mantine/core';
import { setNotesBook, setNotesSearch, setNotesTags } from 'store/NotesSlice';

function getAutocompleteOptions({ value, setState, section }) {
  if (value.length >= 2) {
    setState({ loading: true });

    remoteRequest({
      url: 'notes/actions',
      data: {
        action: 'autocomplete',
        term: value,
        ...(section !== 'all' && { section: section }),
      },
      onSuccess: (response) => {
        const options = [];

        if (Array.isArray(response.notes)) {
          for (const note of response.notes) {
            options.push({
              value: note.label,
              id: note.id,
              group: 'Notes',
            });
          }
        }

        if (Array.isArray(response.books)) {
          for (const book of response.books) {
            options.push({
              value: book.label,
              id: book.id,
              group: 'Books',
            });
          }
        }

        if (Array.isArray(response.tags)) {
          for (const tag of response.tags) {
            options.push({
              value: tag.label,
              id: tag.id,
              group: 'Tags',
            });
          }
        }

        setState({ options: options, loading: false });
      },
    });
  }
}

function onItemSelect({ value, id, group, setState, dispatch }) {
  if (group === 'Notes') {
    openModal({ name: 'note', data: { id, tab: 'view' } });
  } else if (group === 'Books') {
    dispatch(setNotesBook(value));
    dispatchEvent(events.list.search);
  } else if (group === 'Tags') {
    dispatch(setNotesTags([value]));
    dispatchEvent(events.list.search);
  }

  setState({ options: [] });
}

function Search() {
  const dispatch = useAppDispatch();
  const isItemSelected = useRef(false);
  const theme = useMantineTheme();
  const [state, setState] = useSetState({
    loading: false,
    value: '',
    options: [],
  });

  const { value, loading, options } = state;

  const { navBarValue, navBarValueId, section } = useAppSelector((state) => ({
    navBarValue: state.NavBarAutoComplete.value,
    navBarValueId: state.NavBarAutoComplete.valueId,
    section: state.Notes.section,
  }));

  const onSearch = useRef(
    debounce((v) => getAutocompleteOptions({ value: v, setState, section }), 400),
  );

  const onChange = (value) => {
    setState({ value });
    onSearch.current(value);
  };

  useEffect(() => {
    onChange(navBarValue);
  }, [navBarValueId, navBarValue]);

  return (
    <Autocomplete
      limit={200}
      maxDropdownHeight={220}
      icon={<MdSearch size={25} color={theme.colorScheme === 'dark' ? '#e9ecef' : '#000'} />}
      value={value}
      placeholder="Search"
      onChange={onChange}
      rightSection={
        loading ? (
          <Loader size={20} color={theme.colorScheme === 'dark' ? 'white' : 'gray'} />
        ) : value.length > 0 ? (
          <CloseButton
            onClick={() => {
              onChange('');
            }}
          />
        ) : undefined
      }
      onItemSubmit={(item: { value: string; id: number; group: string }) => {
        isItemSelected.current = true;
        onItemSelect({ ...item, setState, dispatch });
        onChange('');
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          if (isItemSelected.current) {
            isItemSelected.current = false;
          } else {
            dispatch(setNotesSearch(value));
            dispatchEvent(events.list.search);
            setState({ options: [] });
          }
        }
      }}
      data={options}
    />
  );
}

export default Search;
