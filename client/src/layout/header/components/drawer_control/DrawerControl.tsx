import { dispatch } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import { MdMenu } from 'react-icons/md';
import { useMantineTheme, ActionIcon } from '@mantine/core';

function DrawerControl() {
  const theme = useMantineTheme();
  return (
    <ActionIcon
      size={50}
      variant="transparent"
      onClick={() => {
        dispatch(events.drawer.open);
      }}
      color={theme.colorScheme === 'dark' ? 'gray' : 'white'}>
      <MdMenu size={40} />
    </ActionIcon>
  );
}

export default DrawerControl;
