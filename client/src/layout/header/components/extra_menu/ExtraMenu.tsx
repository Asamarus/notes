import { lazy } from 'react';
import { Menu } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { MdMoreVert, MdListAlt, MdVpnKey, MdLogout, MdOutlineTableRows } from 'react-icons/md';
import { openModal } from 'common/modals';
import { useMantineTheme } from '@mantine/core';
import ComponentLoader from 'common/component_loader';

const UpdatePasswordForm = lazy(() => import('./components/update_password_form'));
const TabularDataForm = lazy(() => import('./components/tabular_data_form'));
const SectionsAdministration = lazy(() => import('./components/sections_administration'));

function ExtraMenu() {
  const theme = useMantineTheme();
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          size={30}
          variant="transparent"
          color={theme.colorScheme === 'dark' ? 'gray' : 'white'}>
          <MdMoreVert size={30} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Extra actions</Menu.Label>
        <Menu.Item
          icon={<MdListAlt size={18} />}
          onClick={() => {
            openModal({
              name: 'content',
              settings: {
                title: 'Sections',
                withModalHeader: false,
                closeOnClickOutside: false,
                size: 800,
                paperProps: {
                  sx: (theme) => ({
                    border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
                  }),
                },
              },
              data: {
                children: (
                  <ComponentLoader>
                    <SectionsAdministration />
                  </ComponentLoader>
                ),
              },
            });
          }}>
          Sections
        </Menu.Item>
        <Menu.Item
          icon={<MdOutlineTableRows size={18} />}
          onClick={() => {
            openModal({
              name: 'content',
              settings: {
                title: 'Tabular data',
                withModalHeader: false,
                closeOnClickOutside: false,
                size: 800,
                paperProps: {
                  sx: (theme) => ({
                    border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
                  }),
                },
              },
              data: {
                children: (
                  <ComponentLoader>
                    <TabularDataForm />
                  </ComponentLoader>
                ),
              },
            });
          }}>
          Tabular data
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          icon={<MdVpnKey size={18} />}
          onClick={() => {
            openModal({
              name: 'content',
              settings: {
                title: 'Update password',
                withModalHeader: false,
                closeOnClickOutside: false,
                size: 500,
                paperProps: {
                  sx: (theme) => ({
                    border: theme.colorScheme === 'dark' ? '1px solid #5f6368' : '1px solid #ddd',
                  }),
                },
              },
              data: {
                children: (
                  <ComponentLoader>
                    <UpdatePasswordForm />
                  </ComponentLoader>
                ),
              },
            });
          }}>
          Change password
        </Menu.Item>
        <Menu.Item
          icon={<MdLogout size={18} />}
          onClick={() => {
            window.location.href = '/logout';
          }}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ExtraMenu;
