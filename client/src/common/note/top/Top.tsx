import ContextMenu from 'common/context_menu';
import { dispatch } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import type { Note as NoteData } from 'store/NotesSlice';
import useStyles from './Top.styles';
import { CloseButton } from '@mantine/core';

export interface TopProps {
  /** Type */
  type: 'list' | 'modal' | 'page';

  /** Note */
  note: NoteData;
}
function Top({ note, type }: TopProps) {
  const { classes } = useStyles();
  return (
    <div
      className={classes.wrapper}
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <span className={classes.info}>{`#${note.sync_id} ${note.created_at}`}</span>
      <ContextMenu note={note} type={type} />
      {type === 'modal' && (
        <CloseButton
          className={classes.closeIcon}
          variant="transparent"
          size={24}
          onClick={() => {
            dispatch(events.note.close);
          }}
        />
      )}
    </div>
  );
}

export default Top;
