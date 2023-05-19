import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    height: '42px',
    borderBottom: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #ddd',
  },
}));
