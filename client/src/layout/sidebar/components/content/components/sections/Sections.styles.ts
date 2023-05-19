import { createStyles } from '@mantine/core';

export interface SectionsStylesParams {
  backgroundColor: string;
}

export default createStyles((theme, { backgroundColor }: SectionsStylesParams) => ({
  header: {
    backgroundColor: theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.055)' : backgroundColor,
    cursor: 'pointer',
    padding: '10px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
  },
  title: {
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  caret: {
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#fff',
  },
  section: {
    textDecoration: 'none',
    userSelect: 'none',
    cursor: 'pointer',
    color: theme.colorScheme === 'dark' ? '#C1C2C5' : '#fff',
    display: 'flex',
    height: '40px',
    alignItems: 'center',
    padding: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderBottom: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #fff',
    ':first-of-type': {
      borderTop: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #fff',
    },
  },
}));
