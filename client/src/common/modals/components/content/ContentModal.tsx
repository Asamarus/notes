import React from 'react';

import type { ModalData } from 'common/modals/types';

export const modalData: ModalData = {
  name: 'content',
  inUrl: false,
  component: ContentModal,
  modalProps: {
    title: 'This is content modal',
    withCloseButton: true,
  },
};

export interface ContentModalProps {
  children: React.ReactNode;
}

function ContentModal({ children }: ContentModalProps) {
  return <>{children}</>;
}

export default ContentModal;
