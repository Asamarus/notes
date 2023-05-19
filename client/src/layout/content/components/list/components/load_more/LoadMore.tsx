import { Button, Center } from '@mantine/core';

export interface LoadMoreProps {
  /** Loading */
  loading: boolean;

  /** On click callback */
  onClick: () => void;
}
function LoadMore({ loading, onClick }: LoadMoreProps) {
  return (
    <Center>
      <Button onClick={onClick} loading={loading} mt={20}>
        Load more
      </Button>
    </Center>
  );
}

export default LoadMore;
