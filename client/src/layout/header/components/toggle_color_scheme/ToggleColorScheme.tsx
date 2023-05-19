import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import remoteRequest from 'utils/remoteRequest';

function ToggleColorScheme() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      size={30}
      variant="transparent"
      color={dark ? 'yellow' : 'white'}
      onClick={() => {
        remoteRequest({
          url: 'misc/actions',
          data: {
            action: 'set_color_scheme',
            color_scheme: colorScheme === 'dark' ? 'light' : 'dark',
          },
        });
        toggleColorScheme();
      }}
      title="Toggle color scheme">
      {dark ? <MdLightMode size={30} /> : <MdDarkMode size={30} />}
    </ActionIcon>
  );
}

export default ToggleColorScheme;
