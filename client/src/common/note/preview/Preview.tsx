import { useState, useEffect } from 'react';

import useStyles from './Preview.styles';
import type { Note as NoteData } from 'store/NotesSlice';
import { Highlight } from '@mantine/core';
import { useAppSelector } from 'hooks';
import getKeywords from 'helpers/getKeywords';
import isEmpty from 'helpers/isEmpty';

export interface PreviewProps {
  /** Note */
  note: NoteData;
}
function Preview({ note }: PreviewProps) {
  const { classes } = useStyles();
  const [showHighlight, setShowHighlight] = useState(false);

  const keywords = useAppSelector((state) => state.Notes.keywords);

  useEffect(() => {
    setShowHighlight(!isEmpty(keywords));
  }, [keywords]);

  return (
    <div className={classes.wrapper}>
      {!showHighlight && note.preview}
      {showHighlight && (
        <Highlight highlightColor="yellow" highlight={getKeywords(keywords)}>
          {note.preview}
        </Highlight>
      )}
    </div>
  );
}

export default Preview;
