import useStyles from './NavigationBar.styles';
import { ActionIcon } from '@mantine/core';
import { MdClear } from 'react-icons/md';
import { useMantineTheme } from '@mantine/core';
import isEmpty from 'helpers/isEmpty';
import join from 'lodash/join';
import { useAppSelector, useAppDispatch } from 'hooks';
import units from 'helpers/units';
import randomId from 'utils/random-id';
import { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import { setNavBarAutoComplete } from 'store/NavBarAutoCompleteSlice';
import {
  setNotesBook,
  setNotesDate,
  setNotesSearch,
  setNotesTags,
  setNotesWithoutBook,
  setNotesWithoutTags,
  setNotesInRandomOrder,
} from 'store/NotesSlice';

function renderText({ keywords, withoutBook, withoutTags, inRandomOrder }) {
  const extra = [];

  if (!isEmpty(keywords)) {
    extra.push(`with keywords: "${join(keywords, ', ')}"`);
  }

  if (withoutBook) {
    extra.push('without book');
  }

  if (withoutTags) {
    extra.push('without tags');
  }

  if (inRandomOrder) {
    extra.push('in random order');
  }

  return join(extra, ' ');
}

function NavigationBar() {
  const dispatch = useAppDispatch();
  const { keywords, total, book, date, tags, inRandomOrder, withoutBook, withoutTags } =
    useAppSelector((state) => ({
      keywords: state.Notes.keywords,
      total: state.Notes.total,
      book: state.Notes.book,
      date: state.Notes.date,
      tags: state.Notes.tags,
      inRandomOrder: state.Notes.inRandomOrder,
      withoutBook: state.Notes.withoutBook,
      withoutTags: state.Notes.withoutTags,
    }));

  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <ActionIcon
        className={classes.resetIcon}
        size={40}
        variant="transparent"
        onClick={() => {
          dispatch(setNavBarAutoComplete({ value: '', valueId: randomId() }));
          dispatch(setNotesSearch(''));
          dispatch(setNotesBook(''));
          dispatch(setNotesTags([]));
          dispatch(setNotesDate(''));
          dispatch(setNotesWithoutBook(false));
          dispatch(setNotesWithoutTags(false));
          dispatch(setNotesInRandomOrder(false));

          dispatchEvent(events.list.search);
        }}
        color={theme.colorScheme === 'dark' ? 'gray' : 'white'}>
        <MdClear size={40} />
      </ActionIcon>
      <div className={classes.info}>
        <span>
          Found <b>{total}</b>{' '}
          {units(total, {
            nom: 'note',
            gen: 'notes',
            plu: 'notes',
          })}{' '}
          {renderText({ keywords, withoutBook, withoutTags, inRandomOrder })}
        </span>
      </div>
      {!isEmpty(book) && (
        <div
          className={`${classes.label} ${classes.label_book}`}
          onClick={() => {
            dispatch(setNotesBook(''));
            dispatchEvent(events.list.search);
          }}>
          {book}
        </div>
      )}

      {Array.isArray(tags) &&
        tags.map((tag) => (
          <div
            key={tag}
            className={`${classes.label} ${classes.label_tag}`}
            onClick={() => {
              dispatch(setNotesTags(tags.filter((t) => t !== tag)));
              dispatchEvent(events.list.search);
            }}>
            {tag}
          </div>
        ))}

      {!isEmpty(date) && (
        <div
          className={`${classes.label} ${classes.label_date}`}
          onClick={() => {
            dispatch(setNotesDate(''));
            dispatchEvent(events.list.search);
          }}>
          {date}
        </div>
      )}
    </div>
  );
}

export default NavigationBar;
