import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    borderTop: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
    padding: '5px',
    minHeight: '30px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '5px',
  },
  tag: {
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
