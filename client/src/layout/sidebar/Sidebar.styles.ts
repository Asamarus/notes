import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: { width: '260px', position: 'fixed', zIndex: 101 },
  content: {
    backgroundColor: theme.colorScheme === 'dark' ? '#202020' : '#fff',
    height: '100%',
  },
  decorative: {
    width: '260px',
    position: 'fixed',
    top: '0',
    boxShadow:
      theme.colorScheme === 'dark'
        ? 'rgb(255 255 255 / 5%) -1px 0px 0px 0px inset'
        : '2px 5px 15px 2px rgba(0, 0, 0, 0.1)',
  },
}));
