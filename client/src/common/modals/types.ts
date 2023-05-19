import { ReactNode } from 'react';

import type { ModalProps } from 'common/ui/modal';

export type ConfirmLabels = Record<'confirm' | 'cancel', ReactNode>;

export type ModalSettings = Partial<Omit<ModalProps, 'opened' | 'onClose'>> & {
  modalId?: string;
  onCloseConfirm?(id: string): void;
};

export type OpenModalParams = {
  modalId?: string;
  name: string;
  data?: Record<string, unknown>;
  settings?: ModalSettings;
};

export type ModalData = {
  name: string;
  inUrl?: boolean;
  component: React.ComponentType;
  modalProps?: ModalSettings;
};

export type ActiveModal = {
  id: string;
  name: string;
  inUrl: boolean;
  component: React.ComponentType;
  data: Record<string, unknown>;
  settings: ModalSettings;
  modalProps: ModalSettings;
};

export type ModalsState = {
  modals: string[];
  modalState: Record<string, string>;
};
