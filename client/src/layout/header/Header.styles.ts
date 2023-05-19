import { createStyles } from '@mantine/core';

export interface HeaderStylesParams {
  backgroundColor: string;
}

export default createStyles((theme, { backgroundColor }: HeaderStylesParams) => ({
  wrapper: {
    height: '50px',
    backgroundColor: theme.colorScheme === 'dark' ? '#202020' : backgroundColor,
    userSelect: 'none',
    zIndex: 100,
    position: 'fixed',
    right: 0,
    left: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    '@media (min-width: 1024px)': { padding: '0 20px' },
    '@media (max-width: 1023px)': { paddingLeft: '10px' },
    paddingRight: 'var(--removed-scroll-width) !important',
    borderBottom: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid transparent',
  },
  right_controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  search_wrapper: {
    '@media (min-width: 1024px)': {
      marginLeft: ' 260px',
      width: '500px',
    },
    '@media (max-width: 1023px)': { flex: '1 1 0', marginRight: '10px' },
  },
  divider: {
    '@media (min-width: 1024px)': { flex: '1 1 0' },
  },
}));
