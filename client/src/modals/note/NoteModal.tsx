import { lazy } from 'react';
import type { ModalData } from 'common/modals/types';
import ComponentLoader from 'common/component_loader';
import { openModal, closeModal } from 'common/modals';
import { Text } from '@mantine/core';
import { store } from 'store';
import { setNoteIsNotSaved } from 'store/NoteIsNotSavedSlice';

const Note = lazy(() => import('common/note'));

export const modalData: ModalData = {
  name: 'note',
  inUrl: true,
  component: NoteModal,
  modalProps: {
    closeOnClickOutside: false,
    size: 1024,
    withCloseButton: false,
    withModalHeader: false,
    trapFocus: false,
    //transitionDuration: 0,
    overlayBlur: 5,
    padding: 0,
    paperProps: {
      sx: (theme) => ({
        border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
      }),
    },
    onCloseConfirm: (id) => {
      const notSaved = store.getState().NoteIsNotSaved;

      if (notSaved) {
        openModal({
          name: 'confirmation',
          data: {
            children: <Text size="sm">Are you sure you do not want to save changes?</Text>,
            labels: {
              confirm: 'Close without saving',
              cancel: 'Cancel',
            },
            confirmProps: { color: 'red' },
            onConfirm: () => {
              store.dispatch(setNoteIsNotSaved(false));
              closeModal(id);
            },
          },
          settings: {
            title: 'Your note data is not saved!',
          },
        });
      } else {
        closeModal(id);
      }
    },
  },
};

export interface NoteModalProps {
  id: number;
  tab?: 'view' | 'edit' | 'delete' | 'sources';
  onModalClose(): void;
}

function NoteModal({ id, tab, onModalClose }: NoteModalProps) {
  return (
    <ComponentLoader>
      <Note id={id} tab={tab} onCloseModal={onModalClose} type="modal" />
    </ComponentLoader>
  );
}

export default NoteModal;
