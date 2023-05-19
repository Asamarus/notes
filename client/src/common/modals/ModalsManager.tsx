import React, { useReducer, useRef, useEffect, useCallback } from 'react';
import Modal from 'common/ui/modal';
import randomId from 'utils/random-id';
import { ModalData, ModalSettings, OpenModalParams, ActiveModal } from './types';
import modalsReducer from './reducer';
import { useModalsEvents } from './events';
import { getDefaultZIndex } from '@mantine/core';
import has from 'lodash/has';
import get from 'lodash/get';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useWindowEvent } from '@mantine/hooks';
import rison from 'utils/rison';
import hash from 'object-hash';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

export interface ModalsManagerProps {
  /** List of modals */
  modals: Record<string, ModalData>;

  /** Shared Modal component props, applied for every modal */
  commonModalProps?: ModalSettings;
}

const zIndex = getDefaultZIndex('modal');

function ModalsManager({ modals, commonModalProps }: ModalsManagerProps) {
  const activeModals = useRef<Record<string, ActiveModal>>({});
  const activeModalsStack = useRef<string[]>([]);
  const activeUrlModals = useRef<Record<string, string>>({});

  const location = useLocation();
  const [urlParams, setSearchParams] = useSearchParams();

  const urlParamsEntries = {};

  for (const [key, value] of urlParams.entries()) {
    urlParamsEntries[key] = value;
  }

  const [state, dispatch] = useReducer(modalsReducer, {
    modals: [],
    modalState: {},
  });

  const onOpenModal = useCallback(
    ({ modalId, name, data = {}, settings }: OpenModalParams) => {
      const modal = modals[name];

      if (!modal) {
        console.error('No modal with name:' + name);
        return;
      }

      const id = modalId || randomId();

      if (activeModals.current[id]) {
        console.error(`Modal with id:${id} already added!`);
        return;
      }

      activeModals.current[id] = {
        id,
        name: name,
        inUrl: modal.inUrl,
        component: modal.component,
        data: data,
        settings: settings,
        modalProps: modal.modalProps,
      };

      if (modal.inUrl && has(activeUrlModals.current, modal.name)) {
        const oldId = activeUrlModals.current[modal.name];
        activeUrlModals.current[modal.name] = id;
        const { [oldId]: value, ...newActiveModals } = activeModals.current;

        activeModals.current = newActiveModals;

        activeModalsStack.current = [...activeModalsStack.current.filter((m) => m !== oldId), id];

        urlParams.set(modal.name, rison.encode(data));
        setSearchParams(urlParams);

        dispatch({
          type: 'REPLACE',
          payload: [oldId, id],
        });

        return;
      }

      if (modal.inUrl) {
        activeUrlModals.current[modal.name] = id;
        urlParams.set(modal.name, rison.encode(data));
        setSearchParams(urlParams);
      }

      activeModalsStack.current = [...activeModalsStack.current, id];

      dispatch({
        type: 'ADD',
        payload: id,
      });
    },
    [modals, setSearchParams, urlParams],
  );

  const onCloseModal = useCallback((id: string) => {
    if (!has(activeModals.current, id)) {
      console.error(`Modal with id:${id} already closed!`);
      return;
    }
    dispatch({
      type: 'CLOSE',
      payload: id,
    });
  }, []);

  const onKeyUpHandler = (event) => {
    if (event.key == 'Escape' && activeModalsStack.current.length > 0) {
      const modalId = activeModalsStack.current[activeModalsStack.current.length - 1];
      const modal = activeModals.current[modalId];

      if (modal && get(modal, 'modalProps.closeOnEscape', true)) {
        const onCloseConfirm = get(modal, 'modalProps.onCloseConfirm');
        if (typeof onCloseConfirm === 'function') {
          onCloseConfirm(modal.id);
        } else {
          onCloseModal(modal.id);
        }
      }
    }
  };

  useModalsEvents({
    openModal: onOpenModal,
    closeModal: onCloseModal,
  });

  useEffect(() => {
    Object.keys(modals).forEach((key) => {
      const modal = modals[key];
      if (
        modal.inUrl &&
        !has(urlParamsEntries, modal.name) &&
        has(activeUrlModals.current, modal.name)
      ) {
        onCloseModal(activeUrlModals.current[modal.name]);
      }
    });

    Object.keys(modals).forEach((key) => {
      const modal = modals[key];
      if (modal.inUrl && has(urlParamsEntries, modal.name)) {
        const data = rison.decode(urlParamsEntries[modal.name]);
        const currentData = get(
          activeModals.current,
          `${activeUrlModals.current[modal.name]}.data`,
        );
        if (!has(activeUrlModals.current, modal.name) || !isEqual(data, currentData)) {
          onOpenModal({ name: modal.name, data: data });
        }
      }
    });
  }, [location.key, modals, onCloseModal, onOpenModal]);

  useWindowEvent('keyup', onKeyUpHandler);

  return (
    <>
      {state.modals.map((id, index) => {
        const modal = activeModals.current[id];

        if (!modal) {
          return;
        }

        const { data, modalProps, settings, component } = modal;

        const extraProps = {
          ...commonModalProps,
          ...modalProps,
          ...settings,
        };

        const props = {
          key: hash(omit(data, 'children')),
          ...data,
          onModalClose: () => {
            const { onCloseConfirm } = extraProps;
            if (typeof onCloseConfirm === 'function') {
              onCloseConfirm(id);
            } else {
              onCloseModal(id);
            }
          },
        } as any;

        const modalState = state.modalState[id];

        const { onCloseConfirm, ..._extraProps } = extraProps;

        return (
          <Modal
            key={id}
            {..._extraProps}
            zIndex={zIndex + index}
            opened={modalState === 'opened'}
            closeOnEscape={false}
            onMounted={() => {
              window.requestAnimationFrame(() => {
                dispatch({
                  type: 'OPEN',
                  payload: id,
                });
              });
            }}
            onClose={() => {
              const { onCloseConfirm } = extraProps;
              if (typeof onCloseConfirm === 'function') {
                onCloseConfirm(id);
              } else {
                onCloseModal(id);
              }
            }}
            onClosed={() => {
              const { onClosed } = extraProps;

              if (typeof onClosed === 'function') {
                onClosed();
              }

              activeModalsStack.current = activeModalsStack.current.filter((m) => m !== id);

              const { [id]: value, ...newActiveModals } = activeModals.current;
              activeModals.current = newActiveModals;

              if (modal.inUrl) {
                const { [modal.name]: value, ...newActiveUrlModals } = activeUrlModals.current;
                activeUrlModals.current = newActiveUrlModals;

                if (urlParams.has(modal.name)) {
                  urlParams.delete(modal.name);
                  setSearchParams(urlParams);
                }
              }

              dispatch({
                type: 'REMOVE',
                payload: id,
              });
            }}>
            {React.createElement(component, props)}
          </Modal>
        );
      })}
    </>
  );
}

export default ModalsManager;
