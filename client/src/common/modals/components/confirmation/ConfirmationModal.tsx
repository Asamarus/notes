import React from 'react';

import type { ModalData, ConfirmLabels } from 'common/modals/types';

import { Box, Group, GroupProps, Button, ButtonProps } from '@mantine/core';

export const modalData: ModalData = {
  name: 'confirmation',
  inUrl: false,
  component: ConfirmationModal,
  modalProps: {
    size: 600,
    color: 'red',
    title: 'Confirm action',
    withCloseButton: true,
  },
};

export interface ConfirmationModalProps {
  onModalClose?(): void;
  onCancel?(): void;
  onConfirm?(): void;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  cancelProps?: ButtonProps & React.ComponentPropsWithoutRef<'button'>;
  confirmProps?: ButtonProps & React.ComponentPropsWithoutRef<'button'>;
  groupProps?: GroupProps;
  labels?: ConfirmLabels;
  children: React.ReactNode;
}

function ConfirmationModal({
  onModalClose,
  cancelProps,
  confirmProps,
  labels = { cancel: 'Cancel', confirm: 'Confirm' },
  closeOnConfirm = true,
  closeOnCancel = true,
  groupProps,
  onCancel,
  onConfirm,
  children = 'Are you sure?',
}: ConfirmationModalProps) {
  const { cancel: cancelLabel, confirm: confirmLabel } = labels;

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof cancelProps?.onClick === 'function' && cancelProps?.onClick(event);
    typeof onCancel === 'function' && onCancel();
    closeOnCancel && typeof onModalClose === 'function' && onModalClose();
  };

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof confirmProps?.onClick === 'function' && confirmProps?.onClick(event);
    typeof onConfirm === 'function' && onConfirm();
    closeOnConfirm && typeof onModalClose === 'function' && onModalClose();
  };

  return (
    <>
      {children && <Box mb="md">{children}</Box>}

      <Group position="right" {...groupProps}>
        <Button variant="default" {...cancelProps} onClick={handleCancel}>
          {cancelProps?.children || cancelLabel}
        </Button>

        <Button color="red" {...confirmProps} onClick={handleConfirm}>
          {confirmProps?.children || confirmLabel}
        </Button>
      </Group>
    </>
  );
}

export default ConfirmationModal;
