import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { ModalsManager } from '../src/common/modals';
import { defaultModals } from '../src/common/modals';
import { RouterProvider, createMemoryRouter, MemoryRouter } from 'react-router-dom';
import type { ModalData } from '../src/common/modals/types';
import { openModal } from '../src/common/modals/events';

const modalData: ModalData = {
  name: 'modal',
  inUrl: true,
  component: TestModal,
  modalProps: {},
};

function TestModal() {
  return <div>TestModal</div>;
}

describe('Modals manager', () => {
  test('Opens a modal', async () => {
    render(
      <MemoryRouter>
        <ModalsManager modals={{ ...defaultModals }} />
      </MemoryRouter>,
    );

    act(() => {
      openModal({
        modalId: 'modal',
        name: 'content',
        data: { children: <div>TestModal1</div> },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('TestModal1')).toBeInTheDocument();
    });
  });

  test('Opens two modals at same time', async () => {
    render(
      <MemoryRouter>
        <ModalsManager modals={{ ...defaultModals }} />
      </MemoryRouter>,
    );

    act(() => {
      openModal({
        name: 'content',
        data: { children: <div>TestModal1</div> },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('TestModal1')).toBeInTheDocument();
    });

    act(() => {
      openModal({
        name: 'content',
        data: { children: <div>TestModal2</div> },
      });
    });

    await waitFor(() => {
      expect(screen.getByText('TestModal1')).toBeInTheDocument();
      expect(screen.getByText('TestModal2')).toBeInTheDocument();
    });
  });

  test('Opens modal based on URLSearchParams', async () => {
    const FAKE_EVENT = { name: 'test event' };
    const routes = [
      {
        path: '/',
        element: (
          <ModalsManager
            modals={{
              ...defaultModals,
              ...{
                [modalData.name]: modalData,
              },
            }}
          />
        ),
        loader: () => FAKE_EVENT,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    act(() => {
      router.navigate('/?modal=modal');
    });

    await waitFor(() => {
      expect(screen.getByText('TestModal')).toBeInTheDocument();
    });
  });
});
