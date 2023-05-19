import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Group, Button } from '@mantine/core';
import CKEditor from 'common/ui/editors/ckeditor';
import { Base64 } from 'js-base64';
import { useAppDispatch } from 'hooks';
import { store } from 'store';
import { useDidUpdate } from '@mantine/hooks';
import showError from 'helpers/showError';
import useRequest from 'hooks/use-request';
import isEmpty from 'helpers/isEmpty';
import type { Note as NoteData } from 'store/NotesSlice';
import { setNoteIsNotSaved } from 'store/NoteIsNotSavedSlice';
import { setNotesNote } from 'store/NotesSlice';

export interface EditProps {
  /** Note */
  note: NoteData;
}

function Edit({ note }: EditProps) {
  const { loading, alert, request } = useRequest();
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      title: isEmpty(note.title) ? '' : note.title,
      content: isEmpty(note.content) ? '' : note.content,
    },
  });

  useDidUpdate(() => {
    if (store.getState().NoteIsNotSaved) return;
    dispatch(setNoteIsNotSaved(true));
  }, [form.values.title, form.values.content]);

  useEffect(() => {
    const listener = (event) => {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      const notSaved = store.getState().NoteIsNotSaved;
      if (notSaved) {
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', listener);
    return () => window.removeEventListener('beforeunload', listener);
  }, []);

  const { value: CKEditorValue, ...ckEditorProps } = form.getInputProps('content');

  return (
    <>
      {alert}
      <form
        onSubmit={form.onSubmit((values) => {
          request({
            url: 'notes/actions',
            data: {
              action: 'update',
              id: note.id,
              title: values.title,
              content: Base64.encode(values.content),
            },
            onSuccess: ({ response }) => {
              dispatch(setNotesNote(response.note));
              dispatch(setNoteIsNotSaved(false));
            },
            onError: ({ response, isMounted }) => {
              if (!isMounted) return;

              showError(response.msg);
            },
          });
        })}>
        <TextInput
          label="Title"
          labelProps={{ size: '20px', sx: { fontWeight: 'bold' }, mb: 20 }}
          placeholder="Note title"
          mb={20}
          {...form.getInputProps('title')}
        />
        <CKEditor
          label="Content"
          labelProps={{ size: '20px', sx: { fontWeight: 'bold' }, mb: 20 }}
          placeholder="Note content"
          {...ckEditorProps}
          value={note.content}
        />
        <Group position="right" mt="md">
          <Button loading={loading} type="submit">
            Save
          </Button>
        </Group>
      </form>
    </>
  );
}

export default Edit;
