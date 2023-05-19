import { createStyles, CSSObject } from '@mantine/core';
import type { MantineNumberSize } from '@mantine/core';

export interface ModalStylesParams {
  overflow: 'outside' | 'inside';
  size: string | number;
  centered: boolean;
  zIndex: number;
  fullScreen: boolean;
  withModalHeader: boolean;
  radius: MantineNumberSize;
}

function getFullScreenStyles(fullScreen: boolean): CSSObject {
  if (!fullScreen) {
    return {};
  }

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '100vh',
    overflowY: 'auto',
  };
}

export default createStyles(
  (
    theme,
    { overflow, size, centered, zIndex, fullScreen, withModalHeader, radius }: ModalStylesParams,
  ) => ({
    close: {},

    overlay: {
      display: fullScreen ? 'none' : undefined,
    },

    root: {
      position: 'fixed',
      zIndex,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    inner: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
      padding: fullScreen ? 0 : '48px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: centered ? 'center' : 'flex-start',
      zIndex: zIndex - 1,
    },

    title: {
      marginRight: theme.spacing.md,
      textOverflow: 'ellipsis',
      display: 'block',
      wordBreak: 'break-word',
    },

    modal: {
      position: 'relative',
      width: fullScreen ? '100vw' : size,
      outline: 0,
      marginTop: centered ? 'auto' : undefined,
      marginBottom: centered ? 'auto' : undefined,
      zIndex: zIndex,
      // marginLeft: fullScreen
      // 	? undefined
      // 	: 'calc(var(--removed-scroll-width, 0px) * -1)',
      ...getFullScreenStyles(fullScreen),
    },

    modal_inner: {
      borderRadius: fullScreen ? 0 : undefined,
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      ...(!fullScreen &&
        withModalHeader && {
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          borderBottomRightRadius: theme.fn.radius(radius),
          borderBottomLeftRadius: theme.fn.radius(radius),
        }),
    },

    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
      marginRight: -9,
    },

    body: {
      maxHeight: overflow === 'inside' ? 'calc(100vh - 185px)' : null,
      overflowY: overflow === 'inside' ? 'auto' : null,
      wordBreak: 'break-word',
    },
  }),
);
