import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagsInput from '../src/common/dialogs/components/tags_input';
import { Provider } from 'react-redux';
import { store } from '../src/store';

describe('TagsInput', () => {
  it('renders initial tags', () => {
    const initialTags = ['tag1', 'tag2'];
    const { getAllByText } = render(
      <Provider store={store}>
        <TagsInput initialTags={initialTags} />
      </Provider>,
    );

    const tagElements = getAllByText(/tag/i);
    expect(tagElements).toHaveLength(initialTags.length);
  });

  it('adds a tag when user types a tag and presses enter', async () => {
    const onChange = jest.fn();
    render(
      <Provider store={store}>
        <TagsInput onChange={onChange} />
      </Provider>,
    );
    const inputElement = screen.getByRole('combobox');
    await userEvent.type(inputElement, 'new tag{enter}');
    expect(onChange).toHaveBeenCalledWith(['new tag']);
  });

  it('does not add a tag when user types a tag with less than 2 characters', async () => {
    const onChange = jest.fn();
    render(
      <Provider store={store}>
        <TagsInput onChange={onChange} />
      </Provider>,
    );
    const inputElement = screen.getByRole('combobox');
    await userEvent.type(inputElement, 'n{enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not add a tag when user types a tag that already exists', async () => {
    const initialTags = ['tag1', 'tag2'];
    const onChange = jest.fn();
    render(
      <Provider store={store}>
        <TagsInput initialTags={initialTags} onChange={onChange} />
      </Provider>,
    );
    const inputElement = screen.getByRole('combobox');
    await userEvent.type(inputElement, 'tag1{enter}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes a tag when user clicks the remove button', async () => {
    const initialTags = ['tag1'];
    const onChange = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <TagsInput initialTags={initialTags} onChange={onChange} />
      </Provider>,
    );
    const removeButtonElement = getByText('×');
    await userEvent.click(removeButtonElement);
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
