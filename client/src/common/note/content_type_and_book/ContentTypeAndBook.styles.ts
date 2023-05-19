import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: { display: 'flex', justifyContent: 'space-between' },
  bookWrapper: { padding: '5px', display: 'flex' },
  contentTypeWrapper: { padding: '5px' },
  contentTypeIcon: { color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#333' },
  bookIcon: {
    marginRight: '5px',
  },
  book: {
    position: 'relative',
    top: '4px',
    fontSize: '16px',
    color: theme.colorScheme === 'dark' ? '#e8eaed' : '#0B78EE',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
      color: theme.colorScheme === 'dark' ? '#e8eaed' : '#23527c',
      textDecoration: 'underline',
      outline: '0',
    },
  },
}));
