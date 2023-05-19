import React, { forwardRef } from 'react';

import {
  DefaultProps,
  Selectors,
  useComponentDefaultProps,
  createPolymorphicComponent,
} from '@mantine/core';
import { Box, CloseButton, CloseButtonProps } from '@mantine/core';
import useStyles, { ModalHeaderStylesParams } from './ModalHeader.styles';
import type { MantineColor, MantineNumberSize } from '@mantine/core';

export type ModalHeaderStylesNames = Selectors<typeof useStyles>;

export interface ModalHeaderProps
  extends DefaultProps<ModalHeaderStylesNames, ModalHeaderStylesParams> {
  /** Color from theme.colors */
  color?: MantineColor;

  /** Radius */
  radius?: MantineNumberSize;

  /** Show close button */
  showClose?: boolean;

  /** Called when close button clicked */
  onClose?(): void;

  /** CloseButton props */
  closeButtonProps?(): CloseButtonProps;

  /** The content of the component */
  children?: React.ReactNode;
}

const defaultProps: Partial<ModalHeaderProps> = {
  showClose: true,
  color: 'blue',
};

export const _ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>((props, ref) => {
  const {
    className,
    color,
    showClose,
    onClose,
    radius,
    children,
    classNames,
    styles,
    unstyled,
    closeButtonProps,
    ...others
  } = useComponentDefaultProps('ModalHeader', defaultProps, props);

  const { classes, cx } = useStyles(
    { radius, color },
    { name: 'ModalHeader', unstyled, classNames, styles },
  );

  return (
    <Box component="div" ref={ref} className={cx(classes.root, className)} {...others}>
      <div className={classes.inner}>{children}</div>
      {showClose && (
        <div className={classes.close_wrapper}>
          <CloseButton
            color="white"
            onClick={onClose}
            variant="transparent"
            {...closeButtonProps}
          />
        </div>
      )}
    </Box>
  );
});

const ModalHeader = createPolymorphicComponent<'div', ModalHeaderProps>(_ModalHeader);

export default ModalHeader;
