import React, { Suspense } from 'react';
import { Box, Loader } from '@mantine/core';

const LoadingIndicator = () => (
  <Box
    sx={{
      height: '100%',
      minHeight: 70,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Loader size={50} />
  </Box>
);

export interface ComponentLoaderProps {
  /** The content of the component */
  children?: React.ReactNode;
}
function ComponentLoader({ children }: ComponentLoaderProps) {
  return <Suspense fallback={<LoadingIndicator />}>{children}</Suspense>;
}

export default ComponentLoader;
