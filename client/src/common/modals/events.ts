import createUseExternalEvents from 'utils/create-use-external-events';
import { OpenModalParams } from './types';

type ModalsEvents = {
  openModal(params: OpenModalParams): void;
  closeModal(id: string): void;
};

export const [useModalsEvents, createEvent] =
  createUseExternalEvents<ModalsEvents>('modules-modals');

export const openModal = createEvent('openModal');
export const closeModal = createEvent('closeModal');
