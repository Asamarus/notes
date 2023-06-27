import type { MantineThemeOverride } from '@mantine/core';

const theme: MantineThemeOverride = {
  colors: {
    white: [
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
    ],
  },
  cursorType: 'pointer',
  activeStyles: { boxShadow: 'inset 0 0 0 100px rgb(0 0 0 / 10%)', transform: 'translateY(0)' },
  components: {
    Menu: {
      defaultProps: {
        withinPortal: true,
      },
    },
    Autocomplete: {
      defaultProps: {
        withinPortal: true,
      },
    },
    ActionIcon: {
      defaultProps: {
        color: 'dark',
      },
    },
    Textarea: {
      defaultProps: {
        autosize: true,
      },
    },
  },
  globalStyles: (theme) => ({
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },

    html: {
      fontSize: '16px',
      colorScheme: theme.colorScheme === 'dark' ? 'dark' : 'light',
      height: '100%',
    },

    body: {
      ...theme.fn.fontStyles(),
      backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : '#e8e8e8',
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      lineHeight: theme.lineHeight,
      fontSize: theme.fontSizes.md,
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      height: '100%',
      margin: '0',
      padding: '0',
      minHeight: '100%',
      position: 'relative',
      overflowY: 'scroll',
    },

    '#app': { height: '100%' },

    '::-webkit-scrollbar': {
      background: 'rgb(206, 206, 206)',
      overflow: 'visible',
      width: '5px',
      height: '5px',
    },

    '::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'rgba(103, 98, 98, 0.52)',
      borderRadius: '0',
    },

    '::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      border: 'none',
    },

    mark: {
      backgroundColor: theme.colorScheme === 'dark' ? '#fcc419' : '#ffec99',
      color: theme.colorScheme === 'dark' ? '#101113' : 'inherit',
    },

    '.ck-content code': {
      color: theme.colorScheme === 'dark' ? '#efefef' : 'inherit',
    },

    '.table': {
      margin: '0',
      position: 'relative',
      minHeight: '.01%',
      width: '100%',
      overflowX: 'auto',
    },
  }),
};

export default theme;
