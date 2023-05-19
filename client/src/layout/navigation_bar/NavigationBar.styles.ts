import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    userSelect: 'none',
    height: '50px',
    width: '100%',
    backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : '#3f51b5',
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)',
    position: 'fixed',
    top: '50px',
    overflowY: 'hidden',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    zIndex: 100,
    '@media (min-width: 1024px)': { marginLeft: '260px' },
    paddingRight: 'var(--removed-scroll-width) !important',
  },
  resetIcon: {
    marginLeft: '10px',
  },
  info: {
    fontSize: '18px',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#fff',
  },
  label: {
    color: theme.colorScheme === 'dark' ? '#f5f8ff' : '#fff',
    padding: '5px 10px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  label_book: {
    backgroundColor: theme.colorScheme === 'dark' ? '#d14d4c' : '#de3f3e',
  },
  label_tag: {
    backgroundColor: theme.colorScheme === 'dark' ? '#71911e' : '#97c224',
  },
  label_date: {
    backgroundColor: theme.colorScheme === 'dark' ? '#32B7B7' : '#32B7B7',
  },
}));
