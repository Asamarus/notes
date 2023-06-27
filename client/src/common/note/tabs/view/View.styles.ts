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

    '& table': {
      border: '1px double #b3b3b3',
      borderCollapse: 'collapse',
      borderSpacing: '0',
      width: '100%',
      maxWidth: '100%',
      '& th': {
        border: '1px solid #bfbfbf',
        minWidth: '2em',
        padding: '.4em',
        background: 'rgba(0,0,0,.05)',
        fontWeight: 700,
        textAlign: 'left',
      },
      '& td': {
        border: '1px solid #bfbfbf',
        minWidth: '2em',
        padding: '.4em',
      },
    },
  },
}));
