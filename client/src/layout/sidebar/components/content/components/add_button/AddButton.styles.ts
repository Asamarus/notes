import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
  },
  button: {
    userSelect: 'none',
    width: '100%',
    cursor: 'pointer',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    ':hover': {
      backgroundColor: theme.colorScheme === 'dark' ? '#25262b' : '#ececec',
    },
  },
  icon: {
    marginRight: '10px',
    position: 'relative',
    top: '2px',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#333',
  },
  title: {
    fontSize: '20px',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#333',
  },
}));
