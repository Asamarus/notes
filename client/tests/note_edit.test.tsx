import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import Edit from '../src/common/note/tabs/edit';
import { store } from '../src/store';
import { Provider } from 'react-redux';

const server = setupServer(
  rest.post('/api/notes/actions', async (req, res, ctx) => {
    return res(
      ctx.json({
        response: {
          msg: 'Note is updated!',
          note: {
            id: 1,
            sync_id: '1lvc1d4slhto2upi',
            created_at: '2023-05-19 00:51:48',
            updated_at: '2023-05-19 00:51:57',
            title: 'New note title',
            section: 'front_end',
            content: '',
            preview: '',
            search_index: '',
            book: null,
            tags: [],
            extra: null,
            sources: null,
          },
        },
      }),
    );
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Update note', () => {
  it('Should update note', async () => {
    const { getByLabelText, getByText } = render(
      <Provider store={store}>
        <Edit
          note={{
            id: 1,
            sync_id: '1lvc1d4slhto2upi',
            created_at: '2023-05-19 00:51:48',
            updated_at: '2023-05-19 00:51:57',
            title: '',
            section: 'front_end',
            content: '',
            preview: '',
            search_index: '',
            book: null,
            tags: [],
            extra: null,
            sources: null,
          }}
        />
      </Provider>,
    );

    const titleInput = getByLabelText(/Title/i);
    const submitButton = getByText('Save');

    await userEvent.type(titleInput, 'New note title');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Note is updated!')).toBeInTheDocument();
    });
  });
});
