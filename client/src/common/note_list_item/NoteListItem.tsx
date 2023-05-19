import { useAppSelector } from 'hooks';
import { openModal } from 'common/modals';
import Top from 'common/note/top';
import ContentTypeAndBook from 'common/note//content_type_and_book';
import Sources from 'common/note//sources';
import Title from 'common/note//title';
import Preview from 'common/note//preview';
import Bottom from 'common/note//bottom';

import useStyles from './NoteListItem.styles';

export interface NoteListItemProps {
  /** Note id */
  id: number;
}
function NoteListItem({ id }: NoteListItemProps) {
  const { classes } = useStyles();
  const note = useAppSelector((state) => state.Notes.rows[id]);

  return (
    <div
      className={classes.wrapper}
      onClick={() => {
        openModal({ name: 'note', data: { id } });
      }}>
      <Top note={note} type="list" />
      <ContentTypeAndBook note={note} type="list" />
      <Sources note={note} />
      <Title note={note} type="list" />
      <Preview note={note} />
      <Bottom note={note} type="list" />
    </div>
  );
}

export default NoteListItem;
