import { z } from 'zod';
import { Box, TextInput, Button, Group } from '@mantine/core';
import useRequest from 'hooks/use-request';
import { useAppDispatch } from 'hooks';
import { store } from 'store';
import { useForm, zodResolver } from '@mantine/form';
import { Note as NoteData, setNotesNoteSources } from 'store/NotesSlice';
import {
  appendSourcesAdministrationId,
  setSourcesAdministrationItem,
} from 'store/SourcesAdministrationSlice';

const schema = z.object({
  link: z.string().url(),
});

export interface AddFormProps {
  /** Note */
  note: NoteData;
}
function AddForm({ note }: AddFormProps) {
  const dispatch = useAppDispatch();
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      link: '',
    },
  });

  const { loading, alert, request } = useRequest();

  return (
    <Box sx={{ maxWidth: 450 }} mx="auto">
      {alert}
      <form
        onSubmit={form.onSubmit((values: Record<string, unknown>) => {
          request({
            url: 'sources/actions',
            data: { action: 'create', id: note.id, ...values },
            onSuccess: ({ response }) => {
              if (!store.getState().SourcesAdministration.mounted) {
                return;
              }

              form.reset();

              const { item } = response;

              dispatch(appendSourcesAdministrationId(item.id));
              dispatch(setSourcesAdministrationItem(item));
              dispatch(setNotesNoteSources({ id: note.id, sources: response.sources }));
            },
          });
        })}>
        <TextInput withAsterisk label="Link" {...form.getInputProps('link')} />

        <Group position="right" mt="md">
          <Button type="submit" loading={loading}>
            Add
          </Button>
        </Group>
      </form>
    </Box>
  );
}

export default AddForm;
