import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  wrapper: {
    padding: '5px',
    userSelect: 'none',
    height: '100px',
    overflowY: 'auto',
    borderBottom: theme.colorScheme === 'dark' ? '1px solid #373A40' : '1px solid #ddd',
  },
  tag: {
    backgroundColor: '#2f9e44',
    borderRadius: '2px',
    border: '1px solid #2f9e44',
    color: '#fff',
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: 1.4,
    marginBottom: '5px',
    marginRight: '5px',
    verticalAlign: 'top',
  },
  tagTitle: {
    borderBottomRightRadius: '2px',
    borderTopRightRadius: '2px',
    cursor: 'default',
    padding: '2px 5px',
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  tagRemove: {
    cursor: 'pointer',
    borderBottomRightRadius: '2px',
    borderTopRightRadius: '2px',
    borderLeft: '1px solid #fff',
    padding: '1px 5px 3px',
  },
  autocompleteWrapper: {
    display: 'inline-block',
    width: '180px',
    marginBottom: '6px',
    marginTop: '3px',
  },
}));
