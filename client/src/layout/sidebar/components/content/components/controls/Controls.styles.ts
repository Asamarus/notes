import { createStyles } from '@mantine/core';

export interface ControlsStylesParams {
  backgroundColor: string;
}

export default createStyles((theme, { backgroundColor }: ControlsStylesParams) => ({
  header: {
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.055)' : backgroundColor,
  },
  headerIcon: {
    marginRight: '10px',
    position: 'relative',
    top: '2px',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#fff',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#fff',
  },
  item: {
    height: '50px',
    cursor: 'pointer',
    userSelect: 'none',
    padding: '12px',
    borderBottom: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: theme.colorScheme === 'dark' ? '#25262b' : '#ececec',
    },
  },
  item_active: {
    backgroundColor: theme.colorScheme === 'dark' ? '#25262b' : '#ececec',
  },
  itemIcon: {
    marginRight: '10px',
    position: 'relative',
    top: '2px',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#333',
  },
  itemTitle: {
    fontSize: '20px',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#333',
  },
}));
