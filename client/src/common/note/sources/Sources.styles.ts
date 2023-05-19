import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: { userSelect: 'none', padding: '5px' },
  icon: {
    marginRight: '5px',
    cursor: 'pointer',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#333',
  },
  number: {
    position: 'relative',
    bottom: '4px',
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
