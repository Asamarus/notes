import { lazy } from 'react';
import { dispatch } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import ChangeSection from './components/change_section';
import { openModal } from 'common/modals';
import { Menu, ActionIcon } from '@mantine/core';
import {
  MdMoreVert,
  MdOutlineInsertDriveFile,
  MdModeEdit,
  MdPublic,
  MdFolder,
  MdDelete,
  MdOpenInNew,
} from 'react-icons/md';
import type { Note as NoteData } from 'store/NotesSlice';
import openAsPopup from 'helpers/openAsPopup';
import ComponentLoader from 'common/component_loader';

const Sources = lazy(() => import('./components/sources'));

export interface ContextMenuProps {
  /** Note */
  note: NoteData;

  /** Type */
  type: 'list' | 'modal' | 'page';
}

function changeTab({ tab, id, type }) {
  if (type === 'list') {
    openModal({ name: 'note', data: { id, tab } });
  } else {
    dispatch(events.note.changeTab, tab);
  }
}

function ContextMenu({ note, type }: ContextMenuProps) {
  const { id } = note;

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="transparent" size={24}>
          <MdMoreVert size={24} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<MdOutlineInsertDriveFile size={20} />}
          onClick={() => {
            changeTab({ tab: 'view', id, type });
          }}>
          View
        </Menu.Item>
        <Menu.Item
          icon={<MdModeEdit size={18} />}
          onClick={() => {
            changeTab({ tab: 'edit', id, type });
          }}>
          Edit
        </Menu.Item>
        <Menu.Item
          icon={<MdOpenInNew size={18} />}
          onClick={() => {
            openAsPopup(`${location.origin}/${note.section}/${id}`);
          }}>
          Popup
        </Menu.Item>
        <Menu.Item
          icon={<MdPublic size={18} />}
          onClick={() => {
            openModal({
              name: 'content',
              settings: {
                title: 'Sources',
                withModalHeader: false,
                closeOnClickOutside: false,
                size: 600,
                paperProps: {
                  sx: (theme) => ({
                    border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
                  }),
                },
              },
              data: {
                children: (
                  <ComponentLoader>
                    <Sources note={note} />
                  </ComponentLoader>
                ),
              },
            });
          }}>
          Sources
        </Menu.Item>
        <Menu.Item
          icon={<MdFolder size={18} />}
          onClick={() => {
            openModal({
              modalId: 'change_section_form_modal',
              name: 'content',
              settings: {
                title: 'Sections',
                withModalHeader: false,
                closeOnClickOutside: false,
                size: 500,
                paperProps: {
                  sx: (theme) => ({
                    border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
                  }),
                },
              },
              data: { children: <ChangeSection note={note} /> },
            });
          }}>
          Change section
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          icon={<MdDelete size={18} />}
          onClick={() => {
            changeTab({ tab: 'delete', id, type });
          }}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ContextMenu;
