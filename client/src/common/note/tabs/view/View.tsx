import { useEffect, useRef } from 'react';
import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';
import Title from 'common/note/title';
import { Prism } from '@mantine/prism';
import get from 'lodash/get';
import { Language } from 'prism-react-renderer';
import isEmpty from 'helpers/isEmpty';
import type { Note as NoteData } from 'store/NotesSlice';
import getKeywords from 'helpers/getKeywords';
import { useAppSelector } from 'hooks';
import Mark from 'mark.js';

import useStyles from './View.styles';

export interface ViewProps {
  type: 'modal' | 'page';

  /** Note */
  note: NoteData;
}

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      if (domNode.name === 'pre') {
        const language = get(domNode, 'children.0.attribs.class', null);
        const code = get(domNode, 'children.0.children.0.data', null);

        if (language !== null && code !== null && typeof language === 'string') {
          return (
            <Prism language={language.substring(9) as Language} mb={20}>
              {code}
            </Prism>
          );
        }
      }
    }
  },
};

function View({ note, type }: ViewProps) {
  const contentNode = useRef(null);
  const content = isEmpty(note.content) ? '' : note.content;
  const { classes } = useStyles({ type });

  const keywords = useAppSelector((state) => state.Notes.keywords);

  useEffect(() => {
    if (!isEmpty(keywords)) {
      new Mark(contentNode.current).mark(getKeywords(keywords));
    }
  }, [keywords]);

  return (
    <>
      <Title note={note} type="modal" />
      <div ref={contentNode} className={classes.content}>
        {parse(content, options)}
      </div>
    </>
  );
}

export default View;
