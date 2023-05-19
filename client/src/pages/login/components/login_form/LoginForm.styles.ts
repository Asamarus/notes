import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colorScheme === 'light' ? '#fff' : '#202124',
    border: `1px solid ${theme.colorScheme === 'light' ? '#ddd' : '#5f6368'}`,
    borderRadius: '3px',
    boxShadow: '0 1px 1px rgb(0 0 0 / 5%)',
    padding: '20px',
  },
}));
