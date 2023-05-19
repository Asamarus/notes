import { useState, useEffect } from 'react';
import remoteRequest from 'utils/remoteRequest';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Content from './Content';
import theme from './theme';
import { ModalsManager } from 'common/modals';
import modals from 'modals';
import { defaultModals } from 'common/modals';

function getColorScheme() {
  const metaNode = document.querySelector('meta[name="color-scheme"]');

  if (metaNode) {
    const content = metaNode.getAttribute('content');

    if (content === 'light' || content === 'dark') {
      return content;
    }
  }

  return 'light';
}

function App() {
  useEffect(() => {
    setInterval(() => {
      remoteRequest({
        url: 'misc/actions',
        data: {
          action: 'ping',
        },
      });
    }, 1000 * 60 * 5); //every 5 minutes
  }, []);

  const [colorScheme, setColorScheme] = useState<ColorScheme>(getColorScheme());
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...theme, colorScheme }}>
        <Notifications position="top-center" />
        <Content />
        <ModalsManager modals={{ ...defaultModals, ...modals }} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
