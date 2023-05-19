import { createStyles } from '@mantine/core';

export interface MasonryStylesParams {
  columnWidth: string;
  gutter: number;
}

export default createStyles((theme, { columnWidth, gutter }: MasonryStylesParams) => {
  return {
    root: {
      display: 'flex',
      flexFlow: 'column wrap',
      alignContent: 'flex-start',
      boxSizing: 'border-box',
      overflow: 'hidden',
      ...(columnWidth !== '100%' && { margin: `0 -${gutter / 2}px` }),
      '& > *': {
        boxSizing: 'border-box',
        ...(columnWidth !== '100%' && { margin: `${gutter / 2}px` }),
        ...(columnWidth === '100%' && { marginBottom: `${gutter}px` }),
        width: columnWidth,
      },
    },
  };
});
