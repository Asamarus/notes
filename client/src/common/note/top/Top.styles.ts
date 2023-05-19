import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
  },
  info: {
    padding: '5px',
    color: '#656464',
    fontSize: '12px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    flex: '1 1 0',
  },
  closeIcon: {
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#333',
    marginLeft: '5px',
  },
}));
