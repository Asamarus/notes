import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    borderTop: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #ddd',

    userSelect: 'none',
    display: 'flex',
    height: '42px',
  },
  button: {
    cursor: 'pointer',
    padding: '12px',
    fontSize: '16px',
    textAlign: 'center',
    lineHeight: '1',
    flex: '1 1 0',
    transition: 'all 0.3s ease-out',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? '#25262b' : '#eee',
    },
  },
  button_border: {
    borderRight: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #ddd',
  },
}));
