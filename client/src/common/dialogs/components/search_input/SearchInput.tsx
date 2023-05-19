import { useRef, useState } from 'react';

import useStyles from './SearchInput.styles';
import { TextInput, CloseButton } from '@mantine/core';
import { MdSearch } from 'react-icons/md';
import { useMantineTheme } from '@mantine/core';
import debounce from 'lodash/debounce';

export interface SearchInputProps {
  placeholder: string;
  onSearch: (param: string) => void;
  onSubmit?: (param: string) => void;
  onChange?: (param: string) => void;
  initialValue?: string;
}
function SearchInput({
  initialValue = '',
  placeholder,
  onChange,
  onSearch,
  onSubmit,
}: SearchInputProps) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [value, setValue] = useState(initialValue);

  const _onSearch = useRef(debounce((v) => onSearch(v), 400));
  const _onChange = (v: string) => {
    setValue(v);
    if (typeof onChange === 'function') {
      onChange(v);
    }
    _onSearch.current(v);
  };

  return (
    <div className={classes.wrapper}>
      <TextInput
        styles={(theme) => ({
          input: {
            borderColor: 'transparent',
            '&:focus': {
              borderColor: 'transparent',
            },
            backgroundColor: theme.colorScheme === 'dark' ? '#1A1B1E' : '#fff',
          },
        })}
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          const inputValue = event.target.value;
          _onChange(inputValue);
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && typeof onSubmit === 'function') {
            onSubmit(value);
          }
        }}
        icon={<MdSearch size={25} color={theme.colorScheme === 'dark' ? '#e9ecef' : '#000'} />}
        rightSection={
          value.length > 0 ? (
            <CloseButton
              onClick={() => {
                _onChange('');
              }}
            />
          ) : undefined
        }
      />
    </div>
  );
}

export default SearchInput;
