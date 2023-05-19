import React, { useEffect } from 'react';

import { Progress, Text } from '@mantine/core';

import type { ModalData } from 'common/modals/types';

export const modalData: ModalData = {
  name: 'loading',
  inUrl: false,
  component: LoadingModal,
  modalProps: {
    size: 400,
    withCloseButton: false,
    closeOnClickOutside: false,
    closeOnEscape: false,
  },
};

export interface LoadingModalProps {
  children: React.ReactNode;
}

function LoadingModal({
  children = (
    <>
      <Text mb={10}>Loading...</Text>
      <Progress value={100} size="xl" animate />
    </>
  ),
}: LoadingModalProps) {
  //useWindowEvent('beforeunload', listener);

  useEffect(() => {
    const listener = (event) => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', listener);
    return () => window.removeEventListener('beforeunload', listener);
  }, []);

  return <>{children}</>;
}

export default LoadingModal;
