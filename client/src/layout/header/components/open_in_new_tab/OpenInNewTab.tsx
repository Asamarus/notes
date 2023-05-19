import { MdOpenInNew } from 'react-icons/md';
import openAsPopup from 'helpers/openAsPopup';

import { useMantineTheme, ActionIcon } from '@mantine/core';

function OpenInNewTab() {
  const theme = useMantineTheme();
  return (
    <ActionIcon
      size={30}
      variant="transparent"
      color={theme.colorScheme === 'dark' ? 'gray' : 'white'}
      onClick={() => {
        openAsPopup(window.location.href);
      }}>
      <MdOpenInNew size={30} />
    </ActionIcon>
  );
}

export default OpenInNewTab;
