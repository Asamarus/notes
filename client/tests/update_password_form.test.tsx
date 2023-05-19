import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import UpdatePasswordForm from '../src/layout/header/components/extra_menu/components/update_password_form';

const server = setupServer(
  rest.post('/api/users/actions', async (req, res, ctx) => {
    const { current_password, new_password } = await req.json();

    if (current_password === '123456' && new_password === '123456') {
      return res(ctx.json({ response: { msg: 'Password is updated!' } }));
    } else {
      return res(ctx.json({ response: { type: 'error', msg: 'Passwords must be equal!' } }));
    }
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Update password form', () => {
  it('should display a success message when the form is submitted successfully', async () => {
    const { getByLabelText, getAllByLabelText, getByText } = render(<UpdatePasswordForm />);

    const currentPasswordInput = getByLabelText(/Current password/i);
    const newPasswordInput = getAllByLabelText(/New password/i)[0];
    const confirmPasswordInput = getByLabelText(/New password confirmation/i);
    const submitButton = getByText('Update');

    await userEvent.type(currentPasswordInput, '123456');
    await userEvent.type(newPasswordInput, '123456');
    await userEvent.type(confirmPasswordInput, '123456');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Password is updated!')).toBeInTheDocument();
    });
  });

  it('Blank form submission should show validation errors', async () => {
    const { getByText } = render(<UpdatePasswordForm />);

    const submitButton = getByText('Update');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('Password should have at least 6 letters')).toBeInTheDocument();
      expect(getByText('New password should have at least 6 letters')).toBeInTheDocument();
      expect(
        getByText('New password confirmation should have at least 6 letters'),
      ).toBeInTheDocument();
    });
  });

  it('Passwords did not match', async () => {
    const { getByLabelText, getAllByLabelText, getByText } = render(<UpdatePasswordForm />);

    const currentPasswordInput = getByLabelText(/Current password/i);
    const newPasswordInput = getAllByLabelText(/New password/i)[0];
    const confirmPasswordInput = getByLabelText(/New password confirmation/i);
    const submitButton = getByText('Update');

    await userEvent.type(currentPasswordInput, '123456');
    await userEvent.type(newPasswordInput, '654321');
    await userEvent.type(confirmPasswordInput, '123456');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('The passwords did not match!')).toBeInTheDocument();
    });
  });
});
