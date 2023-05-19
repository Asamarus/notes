import { useState, useEffect } from 'react';
import useStyles from './Title.styles';
import type { Note as NoteData } from 'store/NotesSlice';
import { useAppSelector } from 'hooks';
import getKeywords from 'helpers/getKeywords';
import isEmpty from 'helpers/isEmpty';
import { Highlight } from '@mantine/core';

export interface PreviewProps {
  /** Type */
  type: 'list' | 'modal';
  /** Note */
  note: NoteData;
}
function Preview({ note, type }: PreviewProps) {
  const { classes, cx } = useStyles();
  const [showHighlight, setShowHighlight] = useState(false);

  const keywords = useAppSelector((state) => state.Notes.keywords);

  useEffect(() => {
    setShowHighlight(!isEmpty(keywords));
  }, [keywords]);

  return (
    <div
      className={cx({
        [classes.listTitle]: type === 'list',
        [classes.modalTitle]: type === 'modal',
      })}>
      {!showHighlight && note.title}
      {showHighlight && (
        <Highlight highlightColor="yellow" highlight={getKeywords(keywords)}>
          {note.title}
        </Highlight>
      )}
    </div>
  );
}

export default Preview;
