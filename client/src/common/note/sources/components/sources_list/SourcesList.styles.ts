import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    backgroundColor:
      theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.055)' : 'rgba(250,250,250,0.8)',
    boxShadow:
      '0 1px 2px 0 rgba(0,0,0,0.12), 0 1px 1px 0 rgba(0,0,0,0.12), 0 1px 4px 0 rgba(0,0,0,0.12)',
    cursor: 'pointer',
    height: '56px',
    display: 'flex',
    position: 'relative',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  image: { flex: '0 0 auto' },
  info: { flex: '1 1 auto', overflow: 'hidden', padding: '11px 10px' },
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    paddingBottom: '5px',
    color: theme.colorScheme === 'dark' ? '#e8eaed' : '#000',
  },
  domain: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: theme.colorScheme === 'dark' ? '#9aa0a6' : '#000',
    fontSize: '11px',
    fontWeight: 400,
  },
}));
