import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    '@media (min-width: 1024px)': { padding: '120px 20px 20px 280px' },
    '@media (max-width: 1023px)': { padding: '120px 20px 20px' },
  },
}));
