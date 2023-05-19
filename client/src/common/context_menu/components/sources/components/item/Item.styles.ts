import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    paddingBottom: '20px',
  },
  dragIcon: {
    position: 'relative',
    top: '4px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    padding: '10px 20px',
    gap: '20px',
    backgroundColor: theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.055)' : '#fff',
    border: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #ccc',
  },
  content: {
    padding: '10px',
    flex: '1 1 0',
  },
}));
