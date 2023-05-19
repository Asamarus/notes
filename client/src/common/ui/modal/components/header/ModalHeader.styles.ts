import { createStyles, MantineNumberSize, MantineColor } from '@mantine/core';

export interface ModalHeaderStylesParams {
  radius: MantineNumberSize;
  color: MantineColor;
}

export default createStyles((theme, { color, radius }: ModalHeaderStylesParams) => ({
  root: {
    height: 50,
    display: 'flex',
    borderTopRightRadius: theme.fn.radius(radius),
    borderTopLeftRadius: theme.fn.radius(radius),
    backgroundColor: theme.colors[color][8],
    userSelect: 'none',
    gap: 20,
  },
  inner: {
    display: 'flex',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 400,
    flex: '1 1 0',
    alignItems: 'center',
    padding: '0 20px',
  },
  close_wrapper: {
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
