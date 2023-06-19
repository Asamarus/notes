import { useEffect, useRef } from 'react';
import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';
import Title from 'common/note/title';
//import { Prism } from '@mantine/prism';
import { Box } from '@mantine/core';
import get from 'lodash/get';
//import { Language } from 'prism-react-renderer';
import isEmpty from 'helpers/isEmpty';
import type { Note as NoteData } from 'store/NotesSlice';
import getKeywords from 'helpers/getKeywords';
import { useAppSelector } from 'hooks';
import Mark from 'mark.js';
import { Prism } from 'react-syntax-highlighter';
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { useMantineTheme } from '@mantine/core';

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
          return <SyntaxHighlighter language={language.substring(9)} code={code} />;
        }
      }
    }
  },
};

function SyntaxHighlighter({ language, code }: { language: string; code: string }) {
  const theme = useMantineTheme();

  return (
    <Box mb={20}>
      <Prism
        language={language}
        style={theme.colorScheme === 'dark' ? tomorrow : oneLight}
        customStyle={{ fontSize: '13px' }}>
        {code}
      </Prism>
    </Box>
  );
}

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
