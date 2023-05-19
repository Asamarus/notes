import { createStyles } from '@mantine/core';

export interface ViewStylesParams {
  type: 'modal' | 'page';
}

export default createStyles((theme, { type }: ViewStylesParams) => ({
  content: {
    fontFamily: 'Georgia, "Times New Roman", Times, serif',
    fontSize: '18px',
    lineHeight: '150%',
    maxWidth: type === 'modal' ? 'calc(100vw - 52px)' : 'calc(100vw - 20px)',
    overflowX: 'auto',

    '& code': {
      backgroundColor: 'hsla(0,0%,78%,.3)',
    },
  },
}));
