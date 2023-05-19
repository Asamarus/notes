import { useRef, useImperativeHandle, forwardRef } from 'react';

import { Autocomplete } from '@mantine/core';
import isEmpty from 'helpers/isEmpty';
import { useSetState } from '@mantine/hooks';
import useStyles from './TagsInput.styles';
import remoteRequest from 'utils/remoteRequest';
import debounce from 'lodash/debounce';
import { useAppSelector } from 'hooks';
import find from 'lodash/find';
import toLower from 'lodash/toLower';

export interface TagsInputProps {
  onChange?: (param: string[]) => void;
  initialTags?: string[];
}

function search({ value, setState, section }) {
  if (value.length >= 2) {
    remoteRequest({
      url: 'tags/actions',
      data: {
        action: 'autocomplete',
        term: value,
        ...(section !== 'all' && { section: section }),
      },
      onSuccess: (response) => {
        const options = response.options.map((o) => o.value);
        setState({ options: options });
      },
    });
  }
}

const regex = /,/g;

function onAddTag({ value, setState, tags, onChange }) {
  let newTag = value.trim();
  newTag = newTag.replace(regex, '');

  if (newTag.length < 2) {
    return;
  }

  let passed = true;

  const found = find(tags.current, (t) => {
    return toLower(t) === toLower(newTag);
  });

  if (found !== undefined) {
    passed = false;
  }

  if (!passed) {
    return;
  }

  tags.current = [...tags.current, newTag];
  setState({ tags: [...tags.current], value: '', options: [] });

  if (typeof onChange === 'function') {
    onChange([...tags.current]);
  }
}

function TagsInput({ onChange, initialTags }: TagsInputProps, ref) {
  const inputRef = useRef(null);
  const { classes } = useStyles();
  const tags = useRef(!isEmpty(initialTags) ? initialTags : []);
  const [state, setState] = useSetState({
    tags: !isEmpty(initialTags) ? initialTags : [],
    value: '',
    options: [],
  });

  const { section } = useAppSelector((state) => {
    return {
      section: state.Notes.section,
    };
  });

  const onSearch = useRef(debounce((v) => search({ value: v, setState, section }), 400));

  const onAutocompleteChange = (value) => {
    setState({ value });
    onSearch.current(value);
  };

  useImperativeHandle(ref, () => ({
    addTag: (tag) => {
      onAddTag({
        value: tag,
        setState,
        tags: tags,
        onChange,
      });
    },
    removeTag: (tag) => {
      const newTags = state.tags.filter((t) => t !== tag);
      tags.current = newTags;
      setState({ tags: newTags });

      if (typeof onChange === 'function') {
        onChange(newTags);
      }
    },
  }));

  return (
    <div
      className={classes.wrapper}
      onClick={() => {
        inputRef?.current?.focus();
      }}>
      {state.tags.map((tag, index) => (
        <span key={index} className={classes.tag}>
          <span className={classes.tagTitle}>{tag}</span>
          <span
            className={classes.tagRemove}
            onClick={() => {
              const newTags = state.tags.filter((t) => t !== tag);
              tags.current = newTags;
              setState({ tags: newTags });

              if (typeof onChange === 'function') {
                onChange(newTags);
              }
            }}>
            ×
          </span>
        </span>
      ))}
      <div className={classes.autocompleteWrapper}>
        <Autocomplete
          styles={(theme) => ({
            root: {
              padding: 0,
            },
            wrapper: {
              padding: 0,
            },
            input: {
              height: 21,
              minHeight: 21,
              padding: 0,
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              '&:focus': {
                borderColor: 'transparent',
              },
            },
          })}
          ref={inputRef}
          data={state.options}
          limit={30}
          maxDropdownHeight={220}
          value={state.value}
          onChange={onAutocompleteChange}
          onItemSubmit={(item) => {
            onAddTag({
              value: item.value,
              setState,
              tags: tags,
              onChange,
            });
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onAddTag({ value: state.value, setState, tags: tags, onChange });
            }
          }}
        />
      </div>
    </div>
  );
}

export default forwardRef<HTMLElement, TagsInputProps>(TagsInput);
