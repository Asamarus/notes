import { Box, Text } from '@mantine/core';

const NotFoundPage = () => (
  <Box
    sx={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text fw={700} size="xl">
      Page not found
    </Text>
  </Box>
);

export default NotFoundPage;
