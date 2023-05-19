import React, { useEffect, useCallback } from 'react';
import { useScrollLock, useFocusTrap, useFocusReturn, useId } from '@mantine/hooks';
import { Selectors, MantineStyleSystemProps } from '@mantine/core';
import type { MantineNumberSize, MantineShadow, MantineColor } from '@mantine/core';
import {
  Box,
  DefaultProps,
  getDefaultZIndex,
  useComponentDefaultProps,
  CloseButton,
  CloseButtonProps,
  Text,
  Paper,
  PaperProps,
  Overlay,
  OverlayProps,
  OptionalPortal,
  Transition,
  MantineTransition,
} from '@mantine/core';
import useStyles, { ModalStylesParams } from './Modal.styles';
import ModalHeader, { ModalHeaderProps } from './components/header';

export type ModalStylesNames = Selectors<typeof useStyles>;

export interface ModalProps
  extends Omit<DefaultProps<ModalStylesNames, ModalStylesParams>, keyof MantineStyleSystemProps>,
    Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Mounts modal if true */
  opened: boolean;

  /** Called when close button clicked and when escape key is pressed */
  onClose(): void;

  /** Called when Modal closing animation ended */
  onClosed?(): void;

  /** Called when Modal is mounted */
  onMounted?(): void;

  /** Modal title, displayed in header before close button */
  title?: React.ReactNode;

  /** Modal z-index property */
  zIndex?: number;

  /** Control vertical overflow behavior */
  overflow?: 'outside' | 'inside';

  /** Hides close button if set to false, modal still can be closed with escape key and by clicking outside */
  withCloseButton?: boolean;

  /** Overlay opacity */
  overlayOpacity?: number;

  /** Overlay color */
  overlayColor?: string;

  /** Overlay blur in px */
  overlayBlur?: number;

  /** Determines whether the modal should take the entire screen */
  fullScreen?: boolean;

  /** Modal radius */
  radius?: MantineNumberSize;

  /** Modal body width */
  size?: string | number;

  /** Modal body transition */
  transition?: MantineTransition;

  /** Duration in ms of modal transitions, set to 0 to disable all animations */
  transitionDuration?: number;

  /** Exit transition duration in ms, 0 by default */
  exitTransitionDuration?: number;

  /** Modal body transitionTimingFunction, defaults to theme.transitionTimingFunction */
  transitionTimingFunction?: string;

  /** Close button aria-label */
  closeButtonLabel?: string;

  /** id base, used to generate ids to connect modal title and body with aria- attributes, defaults to random id */
  id?: string;

  /** Modal shadow from theme or css value */
  shadow?: MantineShadow;

  /** Modal padding from theme or number value for padding in px */
  padding?: MantineNumberSize;

  /** Should modal be closed when outside click was registered? */
  closeOnClickOutside?: boolean;

  /** Should modal be closed when escape is pressed? */
  closeOnEscape?: boolean;

  /** Disables focus trap */
  trapFocus?: boolean;

  /** Controls if modal should be centered */
  centered?: boolean;

  /** Determines whether scroll should be locked when modal is opened, defaults to true */
  lockScroll?: boolean;

  /** Target element or selector where modal portal should be rendered */
  target?: HTMLElement | string;

  /** Determines whether modal should be rendered within Portal, defaults to true */
  withinPortal?: boolean;

  /** Determines whether focus should be returned to the last active element when drawer is closed */
  withFocusReturn?: boolean;

  /** Paper component props */
  paperProps?: PaperProps;

  /** Use ModalHeader component */
  withModalHeader?: boolean;

  /** ModalHeader color */
  color?: MantineColor;

  /** ModalHeader component props */
  modalHeaderProps?: ModalHeaderProps;

  /** Overlay component props */
  overlayProps?: OverlayProps;

  /** CloseButton component props */
  closeButtonProps?: CloseButtonProps;
}

const defaultProps: Partial<ModalProps> = {
  size: 'md',
  transitionDuration: 250,
  overflow: 'outside',
  padding: 'lg',
  shadow: 'lg',
  closeOnClickOutside: true,
  closeOnEscape: true,
  trapFocus: true,
  withCloseButton: true,
  withinPortal: true,
  lockScroll: true,
  withFocusReturn: true,
  overlayBlur: 0,
  zIndex: getDefaultZIndex('modal'),
  exitTransitionDuration: 0,
  withModalHeader: true,
};

function Modal(props: ModalProps) {
  const {
    className,
    opened,
    title,
    onClose,
    onClosed,
    onMounted,
    children,
    withCloseButton,
    overlayOpacity,
    size,
    transitionDuration,
    exitTransitionDuration,
    closeButtonLabel,
    overlayColor,
    overflow,
    transition,
    padding,
    shadow,
    radius,
    id,
    classNames,
    styles,
    closeOnClickOutside,
    trapFocus,
    closeOnEscape,
    centered,
    target,
    withinPortal,
    zIndex,
    overlayBlur,
    transitionTimingFunction,
    fullScreen,
    unstyled,
    lockScroll: shouldLockScroll,
    withFocusReturn,
    paperProps,
    color,
    withModalHeader,
    modalHeaderProps,
    overlayProps,
    closeButtonProps,
    ...others
  } = useComponentDefaultProps('Modal', defaultProps, props);
  const baseId = useId(id);
  const titleId = `${baseId}-title`;
  const bodyId = `${baseId}-body`;
  const { classes, cx, theme } = useStyles(
    { size, overflow, centered, zIndex, fullScreen, withModalHeader, radius },
    { unstyled, classNames, styles, name: 'Modal' },
  );
  const focusTrapRef = useFocusTrap(trapFocus && opened);
  const _overlayOpacity =
    typeof overlayOpacity === 'number'
      ? overlayOpacity
      : theme.colorScheme === 'dark'
      ? 0.85
      : 0.75;

  useEffect(() => {
    if (typeof onMounted === 'function') {
      onMounted();
    }
  }, []);

  useScrollLock(shouldLockScroll && opened);

  const closeOnEscapePress = useCallback(
    (event: KeyboardEvent) => {
      if (!trapFocus && event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [trapFocus, closeOnEscape, onClose],
  );

  useEffect(() => {
    if (!trapFocus) {
      window.addEventListener('keydown', closeOnEscapePress);
      return () => window.removeEventListener('keydown', closeOnEscapePress);
    }

    return undefined;
  }, [trapFocus, closeOnEscapePress]);

  useFocusReturn({ opened, shouldReturnFocus: trapFocus && withFocusReturn });

  return (
    <OptionalPortal withinPortal={withinPortal} target={target}>
      <Transition
        mounted={opened}
        duration={transitionDuration}
        exitDuration={exitTransitionDuration}
        timingFunction={transitionTimingFunction}
        transition={transition || (fullScreen ? 'fade' : 'pop')}
        onExited={() => {
          if (typeof onClosed === 'function') {
            onClosed();
          }
        }}>
        {(transitionStyles) => (
          <>
            <Box id={baseId} className={cx(classes.root, className)} {...others}>
              <Transition
                mounted={opened}
                duration={transitionDuration / 2}
                exitDuration={exitTransitionDuration}
                timingFunction="ease"
                transition="fade">
                {(overlayTransitionStyles) => (
                  <div style={overlayTransitionStyles}>
                    <Overlay
                      className={classes.overlay}
                      sx={{ position: 'fixed' }}
                      zIndex={zIndex - 1}
                      blur={overlayBlur}
                      color={
                        overlayColor ||
                        (theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.black)
                      }
                      opacity={_overlayOpacity}
                      unstyled={unstyled}
                      {...overlayProps}
                    />
                  </div>
                )}
              </Transition>
              <div
                role="presentation"
                className={classes.inner}
                onClick={() => closeOnClickOutside && onClose()}
                onKeyDown={(event) => {
                  const shouldTrigger =
                    (event.target as any)?.getAttribute('data-modules-stop-propagation') !== 'true';
                  shouldTrigger && event.key === 'Escape' && closeOnEscape && onClose();
                }}
                ref={focusTrapRef}>
                <div
                  className={classes.modal}
                  style={transitionStyles}
                  role="dialog"
                  aria-labelledby={titleId}
                  aria-describedby={bodyId}
                  aria-modal
                  tabIndex={-1}
                  onClick={(event) => event.stopPropagation()}>
                  {withModalHeader && !fullScreen && (
                    <ModalHeader
                      radius={radius}
                      color={color}
                      showClose={withCloseButton}
                      onClose={() => {
                        onClose();
                      }}
                      {...modalHeaderProps}>
                      {title}
                    </ModalHeader>
                  )}
                  <Paper<'div'>
                    className={classes.modal_inner}
                    shadow={shadow}
                    p={padding}
                    unstyled={unstyled}
                    {...paperProps}>
                    {(title || withCloseButton) && !withModalHeader && (
                      <div className={classes.header}>
                        <Text id={titleId} className={classes.title}>
                          {title}
                        </Text>

                        {withCloseButton && (
                          <CloseButton
                            iconSize={16}
                            onClick={onClose}
                            aria-label={closeButtonLabel}
                            className={classes.close}
                            {...closeButtonProps}
                          />
                        )}
                      </div>
                    )}

                    <div id={bodyId} className={classes.body}>
                      {children}
                    </div>
                  </Paper>
                </div>
              </div>
            </Box>
          </>
        )}
      </Transition>
    </OptionalPortal>
  );
}

Modal.displayName = 'Modal';

export default Modal;
