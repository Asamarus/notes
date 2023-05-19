import { useEffect, useState } from 'react';
import useCustomEventListener from 'hooks/use-custom-event-listener';
import events from 'common/events';
import { useAppSelector, useAppDispatch } from 'hooks';
import remoteRequest from 'utils/remoteRequest';
import { Box } from '@mantine/core';
import View from './tabs/view';
import Edit from './tabs/edit';
import Delete from './tabs/delete';
import useIsMounted from 'hooks/use-is-mounted';
import Loading from 'common/ui/loading';
import Top from 'common/note/top';
import ContentTypeAndBook from 'common/note/content_type_and_book';
import Sources from 'common/note/sources';
import Bottom from 'common/note/bottom';
import { setNotesNote } from 'store/NotesSlice';
import isEmpty from 'helpers/isEmpty';

export interface NoteProps {
  /** Note id */
  id: number;
  tab?: 'view' | 'edit' | 'delete' | 'sources';
  type: 'modal' | 'page';
  onCloseModal(): void;
}
function Note({ id, tab = 'view', onCloseModal, type }: NoteProps) {
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState(tab);

  useCustomEventListener(events.note.changeTab, (newTab) => {
    setCurrentTab(newTab);
  });

  useCustomEventListener(events.note.close, () => {
    onCloseModal();
  });

  const note = useAppSelector((state) => state.Notes.rows[id]);
  const isNoteEmpty = isEmpty(note);
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNoteEmpty) {
      setLoading(true);
      remoteRequest({
        url: 'notes/actions',
        data: {
          action: 'get',
          id: id,
        },
        onSuccess: (response) => {
          if (!isMounted()) return;
          setLoading(false);
          dispatch(setNotesNote(response.note));
        },
        onError: (response) => {
          if (!isMounted()) return;
          console.error({ content: response.msg });
        },
      });
    }
  }, [isNoteEmpty]);

  if (loading) {
    <Loading />;
  }

  if (!note) {
    return null;
  }

  let content = null;

  switch (currentTab) {
    case 'view':
      content = <View note={note} type={type} />;
      break;
    case 'edit':
      content = <Edit note={note} />;
      break;
    case 'delete':
      content = <Delete note={note} onCloseModal={onCloseModal} />;
      break;
  }

  return (
    <>
      <Top note={note} type={type} />
      <ContentTypeAndBook note={note} type={type} />
      <Sources note={note} />
      <Box sx={{ padding: 10 }}>{content}</Box>
      <Bottom note={note} type={type} />
    </>
  );
}

export default Note;
