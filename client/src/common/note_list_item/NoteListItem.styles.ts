import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    boxShadow: 'rgba(0, 0, 0, 0.16) 0 2px 5px 0, rgba(0, 0, 0, 0.12) 0 2px 10px 0',

    borderRadius: '5px',
    userSelect: 'none',
    cursor: 'pointer',
    backgroundColor: theme.colorScheme === 'dark' ? '#202124' : '#fff',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.colorScheme === 'dark' ? '#5f6368' : 'transparent',
  },
}));
