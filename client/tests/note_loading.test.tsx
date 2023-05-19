import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Note from '../src/common/note';
import { store } from '../src/store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

const server = setupServer(
  rest.post('/api/notes/actions', async (req, res, ctx) => {
    return res(
      ctx.json({
        response: {
          note: {
            id: 1,
            sync_id: '1lvc1d4slhto2upi',
            created_at: '2023-05-19 00:51:48',
            updated_at: '2023-05-19 00:51:57',
            title: 'New note title',
            section: 'front_end',
            content: '<p>New note content</p>',
            preview: 'New note content',
            search_index: 'new note content',
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

describe('Load note', () => {
  it('Should show note data', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Provider store={store}>
          <Note
            id={1}
            type="page"
            onCloseModal={() => {
              //
            }}
          />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getByText('New note title')).toBeInTheDocument();
      expect(getByText('New note content')).toBeInTheDocument();
    });
  });
});
