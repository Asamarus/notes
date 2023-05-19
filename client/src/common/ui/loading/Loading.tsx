import React from 'react';
import { Box, Loader, useMantineTheme } from '@mantine/core';

function Loading() {
  const theme = useMantineTheme();

  return (
    <Box
      sx={{
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Loader size={40} color={theme.colorScheme === 'dark' ? 'red' : 'dark'} />
    </Box>
  );
}

export default Loading;
