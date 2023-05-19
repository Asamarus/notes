import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 10px',
    '@media (max-width: 1023px)': { marginRight: '30px' },
  },
  title: {
    color: theme.colorScheme === 'dark' ? '#e9ecef' : '#fff',
    fontSize: '16px',
    fontWeight: 500,
  },
}));
