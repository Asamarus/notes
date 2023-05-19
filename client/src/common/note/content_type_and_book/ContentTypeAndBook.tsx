import { lazy } from 'react';
import useStyles from './ContentTypeAndBook.styles';
import { ActionIcon } from '@mantine/core';
import { Note as NoteData, setNotesBook } from 'store/NotesSlice';
import { MdDescription, MdBook } from 'react-icons/md';
import isEmpty from 'helpers/isEmpty';
import { dispatch as dispatchEvent } from 'hooks/use-custom-event-listener';
import { useAppDispatch } from 'hooks';
import events from 'common/events';
import openDialog from 'helpers/openDialog';
import rison from 'utils/rison';
import { useNavigate } from 'react-router-dom';
import ComponentLoader from 'common/component_loader';

const EditBook = lazy(() => import('common/dialogs/edit_book'));

export interface ContentTypeAndBookProps {
  /** Type */
  type: 'list' | 'modal' | 'page';

  /** Note */
  note: NoteData;
}
function ContentTypeAndBook({ note, type }: ContentTypeAndBookProps) {
  const dispatch = useAppDispatch();
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.wrapper}>
      <div className={classes.contentTypeWrapper}>
        <MdDescription size={24} className={classes.contentTypeIcon} />
      </div>

      <div className={classes.bookWrapper}>
        <ActionIcon
          size={26}
          className={classes.bookIcon}
          onClick={(e) => {
            e.stopPropagation();
            openDialog(
              <ComponentLoader>
                <EditBook note={note} />
              </ComponentLoader>,
            );
          }}>
          <MdBook size={24} />
        </ActionIcon>
        {!isEmpty(note.book) && (
          <span
            className={classes.book}
            onClick={(e) => {
              e.stopPropagation();

              if (type === 'page') {
                const searchParams = new URLSearchParams();
                searchParams.append(
                  'list',
                  rison.encode({
                    book: note.book,
                  }),
                );

                navigate(`/${note.section}?${searchParams.toString()}`);
                return;
              }

              dispatch(setNotesBook(note.book));
              dispatchEvent(events.list.search);

              if (type === 'modal') {
                setTimeout(() => {
                  dispatchEvent(events.note.close);
                }, 200);
              }
            }}>
            {note.book}
          </span>
        )}
      </div>
    </div>
  );
}

export default ContentTypeAndBook;
