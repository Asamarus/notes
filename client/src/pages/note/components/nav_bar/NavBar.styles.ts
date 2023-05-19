import { createStyles } from '@mantine/core';

export interface NavBarStylesParams {
  backgroundColor: string;
}

export default createStyles((theme, { backgroundColor }: NavBarStylesParams) => ({
  wrapper: {
    height: '50px',
    backgroundColor: theme.colorScheme === 'dark' ? '#202020' : backgroundColor,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    borderBottom: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid transparent',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.colorScheme === 'dark' ? '#e9ecef' : '#fff',
  },
}));
