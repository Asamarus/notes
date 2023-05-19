import { useState } from 'react';
import useStyles from './AddButton.styles';
import { dispatch } from 'hooks/use-custom-event-listener';
import events from 'common/events';
import { Loader, UnstyledButton, useMantineTheme } from '@mantine/core';
import { MdAddBox } from 'react-icons/md';
import isEmpty from 'helpers/isEmpty';
import remoteRequest from 'utils/remoteRequest';
import { openModal } from 'common/modals';
import showError from 'helpers/showError';
import useIsMounted from 'hooks/use-is-mounted';
import { useAppSelector } from 'hooks';

function AddButton() {
  const isMounted = useIsMounted();
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const theme = useMantineTheme();

  const { section, book } = useAppSelector((state) => ({
    section: state.CurrentSection.name,
    book: state.Notes.book,
  }));

  if (section === 'all') {
    return <div className={classes.wrapper} />;
  }
  return (
    <div className={classes.wrapper}>
      {loading && (
        <Loader color={theme.colorScheme === 'dark' ? 'red' : 'dark'} variant="dots" size={50} />
      )}
      {!loading && (
        <UnstyledButton
          className={classes.button}
          onClick={() => {
            dispatch(events.drawer.close);
            setLoading(true);
            const data = {};

            data['action'] = 'create';
            data['section'] = section;

            if (!isEmpty(book)) {
              data['book'] = book;
            }

            remoteRequest({
              url: '/notes/actions',
              data: data,
              onSuccess: (response) => {
                if (!isMounted()) {
                  return;
                }
                setLoading(false);
                openModal({
                  name: 'note',
                  data: { id: response.note.id, tab: 'edit' },
                });
                dispatch(events.list.search);
              },
              onError: (response) => {
                if (!isMounted()) {
                  return;
                }
                setLoading(false);
                showError(response.msg);
              },
            });
          }}>
          <MdAddBox className={classes.icon} size={20} />
          <span className={classes.title}>Add</span>
        </UnstyledButton>
      )}
    </div>
  );
}

export default AddButton;
