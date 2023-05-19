import { lazy } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks';
import { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import useStyles from './Controls.styles';
import {
  MdBook,
  MdLabel,
  MdFilterAlt,
  MdShuffle,
  MdCalendarToday,
  MdTabUnselected,
  MdLabelOutline,
} from 'react-icons/md';
import { openModal } from 'common/modals';
import openDialog from 'helpers/openDialog';
import { setNotesInRandomOrder, setNotesWithoutBook, setNotesWithoutTags } from 'store/NotesSlice';
import ComponentLoader from 'common/component_loader';

const Calendar = lazy(() => import('common/dialogs/calendar'));
const Books = lazy(() => import('common/dialogs/books'));
const Tags = lazy(() => import('common/dialogs/tags'));

function Controls() {
  const dispatch = useAppDispatch();
  const { backgroundColor, inRandomOrder, withoutBook, withoutTags } = useAppSelector((state) => ({
    backgroundColor: state.CurrentSection.color,
    inRandomOrder: state.Notes.inRandomOrder,
    withoutBook: state.Notes.withoutBook,
    withoutTags: state.Notes.withoutTags,
  }));

  const { classes, cx } = useStyles({ backgroundColor: backgroundColor });

  return (
    <>
      <div className={classes.header}>
        <MdBook className={classes.headerIcon} size={20} />
        <span className={classes.headerTitle}>Books</span>
      </div>
      <div
        className={classes.item}
        onClick={() => {
          dispatchEvent(events.drawer.close);
          openDialog(
            <ComponentLoader>
              <Books />
            </ComponentLoader>,
          );
        }}>
        <MdBook className={classes.itemIcon} size={20} />
        <span className={classes.itemTitle}>Books</span>
      </div>
      <div className={classes.header}>
        <MdLabel className={classes.headerIcon} size={20} />
        <span className={classes.headerTitle}>Tags</span>
      </div>
      <div
        className={classes.item}
        onClick={() => {
          dispatchEvent(events.drawer.close);
          openDialog(
            <ComponentLoader>
              <Tags />
            </ComponentLoader>,
          );
        }}>
        <MdLabel className={classes.itemIcon} size={20} />
        <span className={classes.itemTitle}>Tags</span>
      </div>
      <div className={classes.header}>
        <MdFilterAlt className={classes.headerIcon} size={20} />
        <span className={classes.headerTitle}>Special filters</span>
      </div>
      <div
        className={cx(classes.item, { [classes.item_active]: inRandomOrder })}
        onClick={() => {
          dispatch(setNotesInRandomOrder(!inRandomOrder));
          dispatchEvent(events.drawer.close);
          dispatchEvent(events.list.search);
        }}>
        <MdShuffle className={classes.itemIcon} size={20} />
        <span className={classes.itemTitle}>Random</span>
      </div>
      <div
        className={classes.item}
        onClick={() => {
          dispatchEvent(events.drawer.close);
          openModal({
            modalId: 'modal',
            name: 'content',
            settings: {
              title: '',
              withModalHeader: false,
              closeOnClickOutside: false,
              withCloseButton: true,
              size: 300,
              centered: true,
              padding: 10,
              styles: {
                body: {
                  display: 'flex',
                  justifyContent: 'center',
                },
                header: {
                  marginRight: 0,
                  marginBottom: 0,
                },
              },
              paperProps: {
                sx: (theme) => ({
                  border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
                }),
              },
            },
            data: {
              children: (
                <ComponentLoader>
                  <Calendar />
                </ComponentLoader>
              ),
            },
          });
        }}>
        <MdCalendarToday className={classes.itemIcon} size={20} />
        <span className={classes.itemTitle}>Calendar</span>
      </div>
      <div
        className={cx(classes.item, { [classes.item_active]: withoutBook })}
        onClick={() => {
          dispatch(setNotesWithoutBook(!withoutBook));
          dispatchEvent(events.drawer.close);
          dispatchEvent(events.list.search);
        }}>
        <MdTabUnselected className={classes.itemIcon} size={20} />
        <span className={classes.itemTitle}>Without book</span>
      </div>
      <div
        className={cx(classes.item, { [classes.item_active]: withoutTags })}
        onClick={() => {
          dispatch(setNotesWithoutTags(!withoutTags));
          dispatchEvent(events.drawer.close);
          dispatchEvent(events.list.search);
        }}>
        <MdLabelOutline className={classes.itemIcon} size={20} />
        <span className={classes.itemTitle}>Without tags</span>
      </div>
    </>
  );
}

export default Controls;
