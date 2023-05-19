import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    userSelect: 'none',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    fontSize: '16px',
    padding: '12px',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    borderTop: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #ddd',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? '#25262b' : '#ececec',
    },
    '&:first-of-type': { borderTop: 'none' },
  },
  checkbox: { display: 'inline-block', marginRight: '10px' },
}));
